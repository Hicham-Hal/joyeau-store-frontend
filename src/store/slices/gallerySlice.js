import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as galleryService from "../../services/galleryService";

const sameId = (a, b) => String(a) === String(b);

export const fetchGallery = apiThunk("gallery/fetchAll", () => galleryService.fetchGallery());

export const addGalleryItem = apiThunk("gallery/add", (payload) => galleryService.addGalleryItem(payload));

export const deleteGalleryItem = apiThunk("gallery/delete", async (id) => {
  await galleryService.deleteGalleryItem(id);
  return id;
});

const gallerySlice = createSlice({
  name: "gallery",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })
      .addCase(addGalleryItem.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => !sameId(g.id, action.payload));
      });
  },
});

export default gallerySlice.reducer;
