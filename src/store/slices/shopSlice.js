import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "../apiThunk";
import * as storeService from "../../services/storeService";

// "Shop" = the open / closed switch of the boutique (shown as a banner and
// blocking checkout when closed).
export const fetchStoreStatus = apiThunk("shop/fetchStatus", () => storeService.fetchStoreStatus());

export const setStoreOpen = apiThunk("shop/setOpen", (open) => storeService.setStoreStatus(open));

const shopSlice = createSlice({
  name: "shop",
  initialState: { isOpen: true, loaded: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreStatus.fulfilled, (state, action) => {
        if (typeof action.payload === "boolean") state.isOpen = action.payload;
        state.loaded = true;
      })
      .addCase(fetchStoreStatus.rejected, (state) => {
        // backend unreachable: keep the default (open) instead of blocking the shop
        state.loaded = true;
      })
      // optimistic toggle: flip immediately, roll back if the API fails
      .addCase(setStoreOpen.pending, (state, action) => {
        state.isOpen = action.meta.arg;
      })
      .addCase(setStoreOpen.rejected, (state, action) => {
        state.isOpen = !action.meta.arg;
      });
  },
});

export default shopSlice.reducer;
