import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { Categories } from "./pages/Categories";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Checkout } from "./pages/Checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "catalogo", Component: Catalog },
      { path: "categorias", Component: Categories },
      { path: "produto/:id", Component: ProductDetail },
      { path: "sobre", Component: About },
      { path: "checkout", Component: Checkout },
      {
        path: "*",
        Component: Home,
      },
    ],
  },
]);