import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";

// Backend contract:
//   POST   /messages        -> Message   (public contact form)
//   GET    /messages        -> Message[] (seller only)
//   PATCH  /messages/:id    { read: true }  -> any 2xx
//   DELETE /messages/:id    -> any 2xx

export async function sendMessage(payload) {
  if (USE_MOCK) {
    await delay(500);
    let created;
    updateDb((db) => {
      const maxId = db.messages.reduce((m, msg) => Math.max(m, msg.id), 0);
      created = { ...payload, id: maxId + 1, read: false, createdAt: Date.now() };
      db.messages.unshift(created);
    });
    return created;
  }
  const { data } = await axiosClient.post("/messages", payload);
  return data;
}

export async function fetchMessages() {
  if (USE_MOCK) {
    await delay(350);
    return getDb().messages;
  }
  const { data } = await axiosClient.get("/messages");
  return data;
}

export async function markMessageRead(id) {
  if (USE_MOCK) {
    await delay(200);
    updateDb((db) => {
      db.messages = db.messages.map((m) => (m.id === Number(id) ? { ...m, read: true } : m));
    });
    return true;
  }
  await axiosClient.patch(`/messages/${id}`, { read: true });
  return true;
}

export async function deleteMessage(id) {
  if (USE_MOCK) {
    await delay(250);
    updateDb((db) => {
      db.messages = db.messages.filter((m) => m.id !== Number(id));
    });
    return true;
  }
  await axiosClient.delete(`/messages/${id}`);
  return true;
}
