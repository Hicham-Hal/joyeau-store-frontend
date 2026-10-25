import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as productService from "../../services/productService";

// ids can be numbers (mock) or strings (Mongo/UUID backends): compare as strings.
const sameId = (a, b) => String(a) === String(b);

// The public pages share one cached list. Pass { force: true } to refetch
// (the dashboard does, so the seller always sees fresh data).
export const fetchProducts = apiThunk("products/fetchAll", () => productService.fetchProducts(), {
  condition: (arg, { getState }) => {
    const { status } = getState().products;
    if (status === "loading") return false;
    if (status === "succeeded" && !arg?.force) return false;
    return true;
  },
});

// Resolves with the product, or `null` when the backend answers 404.
export const fetchProductById = apiThunk("products/fetchOne", (id) => productService.fetchProductById(id));

export const createProduct = apiThunk("products/create", (payload) => productService.createProduct(payload));

export const updateProduct = apiThunk("products/update", ({ id, payload }) =>
  productService.updateProduct(id, payload)
);

export const deleteProduct = apiThunk("products/delete", async (id) => {
  await productService.deleteProduct(id);
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    // catalogue
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
    // single product page
    current: null,
    currentStatus: "idle",
    currentError: null,
    currentRequestId: null, // ignores out-of-order responses when navigating quickly
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })

      .addCase(fetchProductById.pending, (state, action) => {
        state.current = null;
        state.currentStatus = "loading";
        state.currentError = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.current = action.payload;
        state.currentStatus = "succeeded";
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentStatus = "failed";
        state.currentError = errorFrom(action);
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const index = state.items.findIndex((p) => sameId(p.id, updated.id));
        if (index !== -1) state.items[index] = updated;
        if (state.current && sameId(state.current.id, updated.id)) state.current = updated;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => !sameId(p.id, action.payload));
      });
  },
});

export default productsSlice.reducer;
