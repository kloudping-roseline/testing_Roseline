import { Routes } from "@angular/router";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard";

export const routes: Routes = [
  {
    path: "",
    title: "Home | Hard Store",
    loadComponent: () => import("./features/home/pages/home.component"),
  },
  {
    path: "tienda/pagina/:numberPage",
    title: "Shop | Hard Store",
    loadComponent: () => import("./features/shop/pages/shop.component"),
  },
  {
    path: "busqueda/pagina/:numberPage/:queryInput",
    title: "Search | Hard Store",
    loadComponent: () => import("./features/shop/pages/shop.component"),
  },
  {
    path: "armar-pc",
    title: "Build a PC | Hard Store",
    loadComponent: () => import("./features/build-pc/pages/build-pc.component"),
  },
  {
    path: "producto/:titleInput",
    title: "Product | Hard Store",
    loadComponent: () => import("./features/product-detail/pages/product-detail.component"),
  },
  {
    path: "carrito",
    title: "Cart | Hard Store",
    loadComponent: () => import("./features/cart/pages/cart.component"),
  },
  {
    path: "favoritos",
    title: "Favorites | Hard Store",
    loadComponent: () => import("./features/favorites/pages/favorites.component"),
  },
  {
    path: "checkout",
    title: "Checkout | Hard Store",
    loadComponent: () => import("./features/checkout/pages/checkout.component"),
  },
  {
    ...canActivate(() => redirectLoggedInTo(["perfil"])),
    path: "auth",
    children: [
      {
        path: "iniciar-sesion",
        title: "Sign In | Hard Store",
        loadComponent: () => import("./features/auth/pages/sign-in/sign-in.component"),
      },
      {
        path: "registrarse",
        title: "Sign Up | Hard Store",
        loadComponent: () => import("./features/auth/pages/sign-up/sign-up.component"),
      },
      {
        path: "recuperar-contraseña",
        title: "Forgot Password | Hard Store",
        loadComponent: () => import("./features/auth/pages/forgot/forgot.component"),
      },
    ],
  },
  {
    ...canActivate(() => redirectUnauthorizedTo(["auth/iniciar-sesion"])),
    path: "perfil",
    title: "Profile | Hard Store",
    loadComponent: () => import("./features/profile/pages/profile.component"),
  },
];
