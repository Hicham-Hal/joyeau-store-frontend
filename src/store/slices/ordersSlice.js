import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as orderService from "../../services/orderService";

const sameId = (a, b) => String(a) === String(b);

export const CURRENT_ORDER_KEY = "jb_current_order";

function loadCurrentOrder() {
  try {
    const raw = sessionStorage.getItem(CURRENT_ORDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return null;
}

// Public checkout, step 1: the customer sends the order (status "unpaid").
// Resolves with the created order (needs `id` + `orderNumber`); it is kept in
// `current` so the payment page (step 2) and the confirmation page can show it.
export const createOrder = apiThunk("orders/create", (orderData) => orderService.createOrder(orderData));

// Public checkout, step 2: "acompte de confirmation".
//   { id, payment: { paymentMethod, deposit, receiptImage? } }
// online -> the order becomes "confirmed", post -> "pending" (the seller checks the receipt)
export const payOrder = apiThunk("orders/pay", ({ id, payment }) => orderService.payOrder(id, payment));

// Seller dashboard
export const fetchOrders = apiThunk("orders/fetchAll", () => orderService.fetchOrders());

export const updateOrderStatus = apiThunk("orders/updateStatus", ({ id, status }) =>
  orderService.updateOrderStatus(id, status)
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [], status: "idle", error: null, current: loadCurrentOrder() },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        if (state.current && sameId(state.current.id, updated.id)) state.current = { ...state.current, ...updated };
        const order = state.items.find((o) => sameId(o.id, updated.id));
        if (order) Object.assign(order, updated);
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated) return;
        const order = state.items.find((o) => sameId(o.id, updated.id));
        if (order) Object.assign(order, updated);
      });
  },
});

export default ordersSlice.reducer;
