import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";
import { normalizeProduct, normalizeProducts } from "../utils/product";

// Backend contract:
//   GET    /products        -> Product[]
//   GET    /products/:id    -> Product            (404 when it does not exist)
//   POST   /products        -> Product            (the created product, with its id)
//   PUT    /products/:id    -> Product            (the updated product)
//   DELETE /products/:id    -> any 2xx

export async function fetchProducts() {
  if (USE_MOCK) {
    await delay(400);
    return normalizeProducts(getDb().products);
  }
  const { data } = await axiosClient.get("/products");
  return normalizeProducts(data);
}

// Resolves to `null` when the product does not exist (so the page can show "not found").
export async function fetchProductById(id) {
  if (USE_MOCK) {
    await delay(300);
    const numId = Number(id);
    return normalizeProduct(getDb().products.find((p) => p.id === numId) || null);
  }
  try {
    const { data } = await axiosClient.get(`/products/${id}`);
    return normalizeProduct(data);
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export async function createProduct(payload) {
  if (USE_MOCK) {
    await delay(500);
    let created;
    updateDb((db) => {
      const maxId = db.products.reduce((m, p) => Math.max(m, p.id), 0);
      created = { ...payload, id: maxId + 1, createdAt: Date.now() };
      db.products.unshift(created);
    });
    return normalizeProduct(created);
  }
  const { data } = await axiosClient.post("/products", payload);
  return normalizeProduct(data);
}

export async function updateProduct(id, payload) {
  if (USE_MOCK) {
    await delay(500);
    let updated;
    updateDb((db) => {
      db.products = db.products.map((p) => {
        if (p.id === Number(id)) {
          updated = { ...p, ...payload };
          return updated;
        }
        return p;
      });
    });
    return normalizeProduct(updated);
  }
  const { data } = await axiosClient.put(`/products/${id}`, payload);
  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  if (USE_MOCK) {
    await delay(400);
    updateDb((db) => {
      db.products = db.products.filter((p) => p.id !== Number(id));
    });
    return true;
  }
  await axiosClient.delete(`/products/${id}`);
  return true;
}
