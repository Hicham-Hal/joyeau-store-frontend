import { createSelector, createSlice } from "@reduxjs/toolkit";

export const CART_STORAGE_KEY = "jb_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore corrupted storage
  }
  return [];
}

// The cart is client-side state: no API call. It is persisted to localStorage
// by the subscriber in `store/index.js`.
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart(), isCartOpen: false, lastAdded: null },
  reducers: {
    addToCart(state, action) {
      // image    = picture shown in the cart (the picture of the chosen color if there is one)
      // bodyNote = what the customer wrote about her body / measurements
      const { product, size, color, quantity = 1, image, bodyNote = "" } = action.payload;
      const note = String(bodyNote || "").trim();
      const key = `${product.id}__${size}__${color}__${note}`;
      const existing = state.items.find((it) => it.key === key);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          key,
          productId: product.id,
          name: product.name,
          image: image || product.images?.[0],
          price: product.price,
          prepDays: product.prepDays,
          size,
          color,
          bodyNote: note,
          quantity,
        });
      }
      state.lastAdded = { product, size, color, quantity };
      state.isCartOpen = true;
    },
    updateQuantity(state, action) {
      const { key, quantity } = action.payload;
      const item = state.items.find((it) => it.key === key);
      if (item) item.quantity = Math.max(1, quantity);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((it) => it.key !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
    setCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCartOpen } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, it) => sum + it.price * it.quantity, 0)
);
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((sum, it) => sum + it.quantity, 0)
);

export default cartSlice.reducer;
