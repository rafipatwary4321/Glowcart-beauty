export const routes = {
  home: "/",
  shop: "/shop",
  cart: "/cart",
  checkout: "/checkout",
  login: "/login",
  register: "/register",
  account: "/account",
  about: "/about",
  contact: "/contact",
  admin: {
    root: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
    customers: "/admin/customers",
    settings: "/admin/settings",
  },
} as const;
