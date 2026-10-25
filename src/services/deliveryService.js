import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";

// Delivery prices (Yalidine changes them from time to time: the seller edits them
// in the dashboard). One entry per wilaya code:
//   { "01": { home: 800, stopdesk: 480 }, "02": { ... }, ... }
//
// Backend contract:
//   GET /delivery-prices   -> the object above            (public)
//   PUT /delivery-prices   -> the whole object, saved     (seller)

export async function fetchDeliveryPrices() {
  if (USE_MOCK) {
    await delay(250);
    return getDb().deliveryPrices;
  }
  const { data } = await axiosClient.get("/delivery-prices");
  return data;
}

export async function saveDeliveryPrices(prices) {
  if (USE_MOCK) {
    await delay(500);
    updateDb((db) => {
      db.deliveryPrices = prices;
    });
    return prices;
  }
  const { data } = await axiosClient.put("/delivery-prices", prices);
  // works whether the backend answers with the saved prices or with nothing
  return data && typeof data === "object" && !Array.isArray(data) && Object.keys(data).length ? data : prices;
}
