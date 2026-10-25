import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";

// Backend contract: GET /store/status -> { open: boolean }
export async function fetchStoreStatus() {
  if (USE_MOCK) {
    await delay(200);
    return getDb().storeOpen;
  }
  const { data } = await axiosClient.get("/store/status");
  return data.open;
}

// Backend contract: PUT /store/status { open } -> { open: boolean }
export async function setStoreStatus(open) {
  if (USE_MOCK) {
    await delay(300);
    updateDb((db) => {
      db.storeOpen = open;
    });
    return open;
  }
  await axiosClient.put("/store/status", { open });
  return open;
}
