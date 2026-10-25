import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";
import { slugify } from "../utils/product";

// Backend contract ("Collections" = types of dresses, edited by the seller):
//   GET    /categories        -> Category[]        { id, fr, ar, image }
//   POST   /categories        { fr, ar, image }    -> Category (with its id)
//   PUT    /categories/:id    { fr, ar, image }    -> Category
//   DELETE /categories/:id    -> any 2xx           (409 when products still use it)

export async function fetchCategories() {
  if (USE_MOCK) {
    await delay(250);
    return getDb().categories;
  }
  const { data } = await axiosClient.get("/categories");
  return data;
}

export async function createCategory(payload) {
  if (USE_MOCK) {
    await delay(400);
    let created;
    updateDb((db) => {
      const base = slugify(payload.fr) || "collection";
      let id = base;
      let n = 2;
      while (db.categories.some((c) => c.id === id)) id = `${base}-${n++}`;
      created = { id, fr: payload.fr, ar: payload.ar || payload.fr, image: payload.image || "" };
      db.categories.push(created);
    });
    return created;
  }
  const { data } = await axiosClient.post("/categories", payload);
  return data;
}

export async function updateCategory(id, payload) {
  if (USE_MOCK) {
    await delay(400);
    let updated;
    updateDb((db) => {
      db.categories = db.categories.map((c) => {
        if (c.id !== id) return c;
        updated = { ...c, fr: payload.fr, ar: payload.ar || payload.fr, image: payload.image ?? c.image };
        return updated;
      });
    });
    return updated;
  }
  const { data } = await axiosClient.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  if (USE_MOCK) {
    await delay(300);
    if (getDb().products.some((p) => p.category === id)) throw new Error("category_in_use");
    updateDb((db) => {
      db.categories = db.categories.filter((c) => c.id !== id);
    });
    return true;
  }
  await axiosClient.delete(`/categories/${id}`);
  return true;
}
