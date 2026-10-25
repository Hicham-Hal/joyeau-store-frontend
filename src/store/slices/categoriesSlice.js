import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as categoryService from "../../services/categoryService";

// "Collections" = the types of dresses (Robes de mariée, Caftans...). The seller
// can add, rename and delete them from the dashboard.
const sameId = (a, b) => String(a) === String(b);

export const fetchCategories = apiThunk("categories/fetchAll", () => categoryService.fetchCategories());

export const createCategory = apiThunk("categories/create", (payload) => categoryService.createCategory(payload));

export const updateCategory = apiThunk("categories/update", ({ id, payload }) =>
  categoryService.updateCategory(id, payload)
);

export const deleteCategory = apiThunk("categories/delete", async (id) => {
  await categoryService.deleteCategory(id);
  return id;
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        if (action.payload) state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const index = state.items.findIndex((c) => sameId(c.id, updated.id));
        if (index !== -1) state.items[index] = updated;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => !sameId(c.id, action.payload));
      });
  },
});

export default categoriesSlice.reducer;
