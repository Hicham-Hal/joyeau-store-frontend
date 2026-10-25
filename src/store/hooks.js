import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCartOpen,
  selectCartItems,
  selectCartSubtotal,
  selectCartCount,
} from "./slices/cartSlice";
import { login as loginThunk, logout as logoutThunk } from "./slices/authSlice";
import { setStoreOpen } from "./slices/shopSlice";

// Types of dresses ("Collections") edited by the seller.
export function useCategories() {
  const items = useSelector((state) => state.categories.items);
  const status = useSelector((state) => state.categories.status);
  return { categories: items, loaded: status === "succeeded", failed: status === "failed" };
}

// getLabel("mariage", "fr") -> "Robes de Mariée"  (falls back to the id)
export function useCategoryLabel() {
  const items = useSelector((state) => state.categories.items);
  return useCallback(
    (id, lang) => {
      const category = items.find((c) => c.id === id);
      return category ? category[lang] || category.fr : id;
    },
    [items]
  );
}

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// ---------------------------------------------------------------------------
// Thin hooks on top of the Redux store. They keep the same names and return
// shapes as the former React contexts, so components read the same way.
// ---------------------------------------------------------------------------

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const count = useSelector(selectCartCount);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);
  const lastAdded = useSelector((state) => state.cart.lastAdded);

  return useMemo(
    () => ({
      items,
      subtotal,
      count,
      isCartOpen,
      lastAdded,
      addToCart: (product, options) => dispatch(addToCart({ product, ...options })),
      updateQuantity: (key, quantity) => dispatch(updateQuantity({ key, quantity })),
      removeFromCart: (key) => dispatch(removeFromCart(key)),
      clearCart: () => dispatch(clearCart()),
      setCartOpen: (open) => dispatch(setCartOpen(open)),
    }),
    [dispatch, items, subtotal, count, isCartOpen, lastAdded]
  );
}

// `login` resolves with the user and throws `{ message, status }` on failure.
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const login = useCallback(
    (username, password) => dispatch(loginThunk({ username, password })).unwrap(),
    [dispatch]
  );
  const logout = useCallback(() => dispatch(logoutThunk()), [dispatch]);

  return useMemo(() => ({ user, login, logout }), [user, login, logout]);
}

// Open / closed switch of the boutique.
export function useStoreStatus() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.shop.isOpen);
  const loaded = useSelector((state) => state.shop.loaded);

  const setOpen = useCallback((open) => dispatch(setStoreOpen(open)), [dispatch]);
  const toggleStore = useCallback(() => dispatch(setStoreOpen(!isOpen)), [dispatch, isOpen]);

  return useMemo(() => ({ isOpen, loaded, toggleStore, setOpen }), [isOpen, loaded, toggleStore, setOpen]);
}
