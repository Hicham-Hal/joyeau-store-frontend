import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as deliveryService from "../../services/deliveryService";

// Delivery prices per wilaya: { "01": { home, stopdesk }, ... }
export const fetchDeliveryPrices = apiThunk("delivery/fetch", () => deliveryService.fetchDeliveryPrices());

// Saves the whole price table (seller dashboard)
export const saveDeliveryPrices = apiThunk("delivery/save", (prices) => deliveryService.saveDeliveryPrices(prices));

const deliverySlice = createSlice({
  name: "delivery",
  initialState: { prices: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryPrices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDeliveryPrices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.prices = action.payload || {};
      })
      .addCase(fetchDeliveryPrices.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })
      .addCase(saveDeliveryPrices.fulfilled, (state, action) => {
        state.prices = action.payload || state.prices;
      });
  },
});

export default deliverySlice.reducer;
