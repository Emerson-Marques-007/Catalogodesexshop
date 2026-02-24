import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase clients
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

const getSupabaseAnonClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );
};

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize storage buckets on startup
const initializeStorage = async () => {
  const supabase = getSupabaseClient();
  const bucketName = 'make-23ba5d8a-products';
  
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      console.log(`Storage bucket ${bucketName} created successfully`);
    }
  } catch (error) {
    console.error(`Error initializing storage: ${error}`);
  }
};

// Call initialization
initializeStorage();

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  // User token comes via X-User-Token header (Authorization carries the anon key for the Supabase gateway)
  const accessToken = c.req.header('X-User-Token');
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - Access token required' }, 401);
  }
  
  const supabase = getSupabaseAnonClient();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.log(`Auth verification failed: ${error?.message}`);
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }
  
  c.set('user', user);
  await next();
};

// Middleware to verify admin role
const requireAdmin = async (c: any, next: any) => {
  const user = c.get('user');
  
  // Get user metadata from KV store
  const userData = await kv.get(`user:${user.id}`);
  
  if (!userData || userData.role !== 'admin') {
    return c.json({ error: 'Forbidden - Admin access required' }, 403);
  }
  
  await next();
};

// ===== HEALTH CHECK =====
app.get("/make-server-23ba5d8a/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ROUTES =====

// Sign up
app.post("/make-server-23ba5d8a/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server isn't configured
      user_metadata: { name }
    });
    
    if (error) {
      console.error(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional user data in KV
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: 'customer',
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email,
        name,
        role: 'customer'
      }
    });
  } catch (error) {
    console.error(`Signup error: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Get current user
app.get("/make-server-23ba5d8a/auth/me", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    let userData = await kv.get(`user:${user.id}`);
    
    // If user data doesn't exist in KV (e.g. created directly in Supabase), create it
    if (!userData) {
      console.log(`User ${user.id} not found in KV store, creating from auth data`);
      userData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'customer',
        createdAt: user.created_at || new Date().toISOString()
      };
      await kv.set(`user:${user.id}`, userData);
    }
    
    return c.json({ user: userData });
  } catch (error) {
    console.error(`Get user error: ${error}`);
    return c.json({ error: 'Internal server error while fetching user' }, 500);
  }
});

// ===== PRODUCT ROUTES =====

// Get all products
app.get("/make-server-23ba5d8a/products", async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    return c.json({ products: products || [] });
  } catch (error) {
    console.error(`Get products error: ${error}`);
    return c.json({ error: 'Internal server error while fetching products' }, 500);
  }
});

// Get single product
app.get("/make-server-23ba5d8a/products/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.error(`Get product error: ${error}`);
    return c.json({ error: 'Internal server error while fetching product' }, 500);
  }
});

// Create product (Admin only)
app.post("/make-server-23ba5d8a/products", requireAuth, requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, price, originalPrice, category, image, badge, inStock, features } = body;
    
    if (!name || !description || !price || !category || !image) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const id = crypto.randomUUID();
    const product = {
      id,
      name,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      category,
      image,
      badge: badge || undefined,
      rating: 0,
      reviews: 0,
      inStock: inStock !== false,
      features: features || [],
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, product);
    
    return c.json({ success: true, product });
  } catch (error) {
    console.error(`Create product error: ${error}`);
    return c.json({ error: 'Internal server error while creating product' }, 500);
  }
});

// Update product (Admin only)
app.put("/make-server-23ba5d8a/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    const updatedProduct = {
      ...existingProduct,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`product:${id}`, updatedProduct);
    
    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error(`Update product error: ${error}`);
    return c.json({ error: 'Internal server error while updating product' }, 500);
  }
});

// Delete product (Admin only)
app.delete("/make-server-23ba5d8a/products/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    
    const product = await kv.get(`product:${id}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    await kv.del(`product:${id}`);
    
    return c.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(`Delete product error: ${error}`);
    return c.json({ error: 'Internal server error while deleting product' }, 500);
  }
});

// ===== CATEGORY ROUTES =====

// Get all categories
app.get("/make-server-23ba5d8a/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix('category:');
    return c.json({ categories: categories || [] });
  } catch (error) {
    console.error(`Get categories error: ${error}`);
    return c.json({ error: 'Internal server error while fetching categories' }, 500);
  }
});

// Create category (Admin only)
app.post("/make-server-23ba5d8a/categories", requireAuth, requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { id, name, description, image } = body;
    
    if (!id || !name || !description || !image) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const category = {
      id,
      name,
      description,
      image,
      productCount: 0,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`category:${id}`, category);
    
    return c.json({ success: true, category });
  } catch (error) {
    console.error(`Create category error: ${error}`);
    return c.json({ error: 'Internal server error while creating category' }, 500);
  }
});

// Update category (Admin only)
app.put("/make-server-23ba5d8a/categories/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existingCategory = await kv.get(`category:${id}`);
    if (!existingCategory) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    const updatedCategory = {
      ...existingCategory,
      ...body,
      id,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`category:${id}`, updatedCategory);
    
    return c.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error(`Update category error: ${error}`);
    return c.json({ error: 'Internal server error while updating category' }, 500);
  }
});

// Delete category (Admin only)
app.delete("/make-server-23ba5d8a/categories/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    
    const category = await kv.get(`category:${id}`);
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    await kv.del(`category:${id}`);
    
    return c.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error(`Delete category error: ${error}`);
    return c.json({ error: 'Internal server error while deleting category' }, 500);
  }
});

// ===== ORDER ROUTES =====

// Create order
app.post("/make-server-23ba5d8a/orders", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const { items, shippingAddress, paymentMethod, total } = body;
    
    if (!items || !shippingAddress || !paymentMethod || !total) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const orderId = crypto.randomUUID();
    const order = {
      id: orderId,
      userId: user.id,
      items,
      shippingAddress,
      paymentMethod,
      total: parseFloat(total),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`order:${orderId}`, order);
    
    // Also store in user's orders list
    const userOrders = await kv.get(`user_orders:${user.id}`) || [];
    userOrders.push(orderId);
    await kv.set(`user_orders:${user.id}`, userOrders);
    
    return c.json({ success: true, order });
  } catch (error) {
    console.error(`Create order error: ${error}`);
    return c.json({ error: 'Internal server error while creating order' }, 500);
  }
});

// Get user orders
app.get("/make-server-23ba5d8a/orders/my-orders", requireAuth, async (c) => {
  try {
    const user = c.get('user');
    const orderIds = await kv.get(`user_orders:${user.id}`) || [];
    
    const orders = await Promise.all(
      orderIds.map(async (id: string) => await kv.get(`order:${id}`))
    );
    
    return c.json({ orders: orders.filter(Boolean) });
  } catch (error) {
    console.error(`Get user orders error: ${error}`);
    return c.json({ error: 'Internal server error while fetching orders' }, 500);
  }
});

// Get all orders (Admin only)
app.get("/make-server-23ba5d8a/orders", requireAuth, requireAdmin, async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.error(`Get all orders error: ${error}`);
    return c.json({ error: 'Internal server error while fetching orders' }, 500);
  }
});

// Update order status (Admin only)
app.put("/make-server-23ba5d8a/orders/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { status } = body;
    
    const order = await kv.get(`order:${id}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    const updatedOrder = {
      ...order,
      status,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`order:${id}`, updatedOrder);
    
    return c.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error(`Update order error: ${error}`);
    return c.json({ error: 'Internal server error while updating order' }, 500);
  }
});

// ===== USER MANAGEMENT ROUTES (Admin only) =====

// Get all users
app.get("/make-server-23ba5d8a/users", requireAuth, requireAdmin, async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    return c.json({ users: users || [] });
  } catch (error) {
    console.error(`Get users error: ${error}`);
    return c.json({ error: 'Internal server error while fetching users' }, 500);
  }
});

// Update user role
app.put("/make-server-23ba5d8a/users/:id", requireAuth, requireAdmin, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { role } = body;
    
    const user = await kv.get(`user:${id}`);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    const updatedUser = {
      ...user,
      role,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`user:${id}`, updatedUser);
    
    return c.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(`Update user error: ${error}`);
    return c.json({ error: 'Internal server error while updating user' }, 500);
  }
});

// ===== IMAGE UPLOAD ROUTE =====

// Upload image (Admin only)
app.post("/make-server-23ba5d8a/upload", requireAuth, requireAdmin, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    const supabase = getSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const bucketName = 'make-23ba5d8a-products';
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.error(`Upload error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }
    
    // Generate signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 31536000);
    
    return c.json({ 
      success: true, 
      url: signedUrlData?.signedUrl,
      path: data.path
    });
  } catch (error) {
    console.error(`Upload error: ${error}`);
    return c.json({ error: 'Internal server error while uploading file' }, 500);
  }
});

// ===== DASHBOARD STATS (Admin only) =====

app.get("/make-server-23ba5d8a/stats", requireAuth, requireAdmin, async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    const orders = await kv.getByPrefix('order:');
    const users = await kv.getByPrefix('user:');
    
    const totalRevenue = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
    const pendingOrders = orders?.filter((order: any) => order.status === 'pending').length || 0;
    
    return c.json({
      stats: {
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        totalUsers: users?.length || 0,
        totalRevenue,
        pendingOrders
      }
    });
  } catch (error) {
    console.error(`Get stats error: ${error}`);
    return c.json({ error: 'Internal server error while fetching stats' }, 500);
  }
});

Deno.serve(app.fetch);