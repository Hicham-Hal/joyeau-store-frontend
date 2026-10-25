import { configureStore } from "@reduxjs/toolkit";
import { setUnauthorizedHandler } from "../api/axiosClient";
import auth, { logout } from "./slices/authSlice";
import products from "./slices/productsSlice";
import gallery from "./slices/gallerySlice";
import orders, { CURRENT_ORDER_KEY } from "./slices/ordersSlice";
import categories from "./slices/categoriesSlice";
import delivery from "./slices/deliverySlice";
import messages from "./slices/messagesSlice";
import shop from "./slices/shopSlice";
import cart, { CART_STORAGE_KEY } from "./slices/cartSlice";

export const store = configureStore({
  reducer: { auth, products, categories, gallery, orders, messages, shop, cart, delivery },
});

// An expired / invalid token (API answered 401) logs the seller out.
setUnauthorizedHandler(() => store.dispatch(logout()));

// Persist the cart to localStorage whenever its items change.
let previousCartItems = store.getState().cart.items;
store.subscribe(() => {
  const items = store.getState().cart.items;
  if (items === previousCartItems) return;
  previousCartItems = items;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // storage full or unavailable: the cart just stays in memory
  }
});

// Keep the order that is being paid (checkout step 2) when the page is refreshed.
let previousCurrentOrder = store.getState().orders.current;
store.subscribe(() => {
  const current = store.getState().orders.current;
  if (current === previousCurrentOrder) return;
  previousCurrentOrder = current;
  try {
    if (current) sessionStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(current));
    else sessionStorage.removeItem(CURRENT_ORDER_KEY);
  } catch (e) {
    // ignore
  }
});

export default store;
