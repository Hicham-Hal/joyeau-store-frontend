import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";

// Order life cycle:
//   1. The customer fills the form and sends the order      -> status "unpaid"
//   2. Last step, "acompte de confirmation":
//        pays online (card)  -> status "confirmed" (automatic)
//        pays via the post   -> status "pending"   (the seller checks the receipt)
//   3. The seller can confirm or refuse ("refused") from the dashboard.
//
// Backend contract:
//   POST  /orders              -> Order  (status "unpaid"; must include `id` and `orderNumber`)
//   POST  /orders/:id/payment  { paymentMethod, deposit, receiptImage? } -> Order  (public)
//   GET   /orders              -> Order[]  (seller only)
//   PATCH /orders/:id          { status }  -> Order  (seller only)

export async function createOrder(orderData) {
  if (USE_MOCK) {
    await delay(600);
    let created;
    updateDb((db) => {
      db.orderSeq += 1;
      created = {
        ...orderData,
        status: "unpaid",
        paid: false,
        paymentMethod: null,
        deposit: null,
        receiptImage: null,
        id: db.orderSeq,
        orderNumber: `JB-${db.orderSeq}`,
        createdAt: Date.now(),
      };
      db.orders.unshift(created);
    });
    return created;
  }
  const { data } = await axiosClient.post("/orders", orderData);
  return data;
}

export async function fetchOrders() {
  if (USE_MOCK) {
    await delay(400);
    return getDb().orders;
  }
  const { data } = await axiosClient.get("/orders");
  return data;
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) {
    await delay(400);
    let updated;
    updateDb((db) => {
      db.orders = db.orders.map((o) => {
        if (o.id === Number(id)) {
          updated = { ...o, status };
          return updated;
        }
        return o;
      });
    });
    return updated;
  }
  const { data } = await axiosClient.patch(`/orders/${id}`, { status });
  // Works whether the backend returns the full order, a partial one, or nothing.
  return { id, status, ...(data || {}) };
}

// Last step of the checkout: the customer pays the confirmation deposit.
//   payment = { paymentMethod: "online" | "post", deposit: 1000 | 1500 | 2000, receiptImage?: url }
export async function payOrder(id, payment) {
  if (USE_MOCK) {
    await delay(700);
    let updated;
    updateDb((db) => {
      db.orders = db.orders.map((o) => {
        if (o.id !== Number(id)) return o;
        const online = payment.paymentMethod === "online";
        updated = {
          ...o,
          paymentMethod: payment.paymentMethod,
          deposit: payment.deposit,
          receiptImage: payment.receiptImage || null,
          paid: online,
          // online payment confirms the order by itself, a post payment waits for the seller
          status: online ? "confirmed" : "pending",
          paidAt: Date.now(),
        };
        return updated;
      });
    });
    if (!updated) throw new Error("order_not_found");
    return updated;
  }
  const { data } = await axiosClient.post(`/orders/${id}/payment`, payment);
  return data;
}
