import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorPage } from "./components/ErrorPage";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Categories } from "./pages/Categories";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProducts } from "./pages/admin/Products";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminUsers } from "./pages/admin/Users";
import { AdminCategories } from "./pages/admin/Categories";
import { DataMigration } from "./pages/admin/DataMigration";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      { path: "catalogo", Component: Catalog },
      { path: "categorias", Component: Categories },
      { path: "produto/:id", Component: ProductDetail },
      { path: "sobre", Component: About },
      { path: "checkout", Component: Checkout },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        Component: Home,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cadastro",
    Component: Signup,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "produtos", Component: AdminProducts },
      { path: "pedidos", Component: AdminOrders },
      { path: "categorias", Component: AdminCategories },
      { path: "usuarios", Component: AdminUsers },
      { path: "migrar-dados", Component: DataMigration },
    ]
  }
]);
