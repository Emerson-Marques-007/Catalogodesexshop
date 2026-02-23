import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "../data/products";
import { toast } from "sonner";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "lujuria_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Carrega o carrinho do localStorage na inicialização
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error("Erro ao carregar carrinho do localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Mostra mensagem de boas-vindas se houver itens salvos
  useEffect(() => {
    if (items.length > 0) {
      const hasShownWelcome = sessionStorage.getItem("cart_welcome_shown");
      if (!hasShownWelcome) {
        setTimeout(() => {
          toast.info("Seus produtos estão te esperando!", {
            description: `Você tem ${items.length} ${items.length === 1 ? "produto" : "produtos"} no carrinho`,
          });
          sessionStorage.setItem("cart_welcome_shown", "true");
        }, 1000);
      }
    }
  }, []);

  // Salva o carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Erro ao salvar carrinho no localStorage:", error);
      }
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        toast.success(`${product.name} - Quantidade atualizada!`, {
          description: `Agora você tem ${existingItem.quantity + quantity} unidades`,
        });
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success(`${product.name} adicionado!`, {
        description: `${quantity} ${quantity > 1 ? "unidades adicionadas" : "unidade adicionada"} ao carrinho`,
      });
      return [...currentItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => {
      const item = currentItems.find((i) => i.id === productId);
      if (item) {
        toast.success(`${item.name} removido do carrinho`);
      }
      return currentItems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Carrinho limpo");
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}