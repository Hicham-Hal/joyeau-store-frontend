// ---------------------------------------------------------------------------
// Lightweight localStorage-backed "fake backend" so the whole demo (cart,
// orders, dashboard CRUD, messages, store status...) behaves like a real
// stateful application between page navigations / reloads, without needing
// a server. Used only when VITE_USE_MOCK is not "false"; otherwise each service
// calls the real backend (see API_CONTRACT.md).
// ---------------------------------------------------------------------------

import { PRODUCTS, ATELIER_GALLERY, CATEGORIES } from "../data/products";
import { DELIVERY_PRICES } from "../data/algeria";

const NAMESPACE = "jb_store_v1";

function readAll() {
  let db = null;
  try {
    const raw = localStorage.getItem(NAMESPACE);
    if (raw) db = JSON.parse(raw);
  } catch (e) {
    console.warn("mockDb: could not parse storage", e);
  }
  if (!db) return seed();
  return withDefaults(db);
}

function writeAll(db) {
  try {
    localStorage.setItem(NAMESPACE, JSON.stringify(db));
  } catch (e) {
    // the browser storage is full (too many uploaded pictures in demo mode)
    throw new Error("storage_full");
  }
}

// Data saved by an older version of the demo does not have the newest tables
// (categories, delivery prices...): add them without touching the existing data.
function withDefaults(db) {
  const base = buildSeed();
  let changed = false;
  Object.keys(base).forEach((key) => {
    if (db[key] === undefined) {
      db[key] = base[key];
      changed = true;
    }
  });
  if (changed) {
    try {
      writeAll(db);
    } catch (e) {
      // keep working in memory
    }
  }
  return db;
}

function buildSeed() {
  return {
    products: PRODUCTS,
    gallery: ATELIER_GALLERY.map((url, i) => ({
      id: i + 1,
      url,
      type: "image",
      placement: i % 2 === 0 ? "about" : "home",
      createdAt: Date.now() - i * 100000,
    })),
    categories: CATEGORIES.map((c) => ({ ...c })),
    deliveryPrices: DELIVERY_PRICES,
    orders: [],
    messages: [],
    storeOpen: true,
    orderSeq: 1000,
  };
}

function seed() {
  const db = buildSeed();
  try {
    writeAll(db);
  } catch (e) {
    // keep working in memory
  }
  return db;
}

export function getDb() {
  return readAll();
}

export function updateDb(mutator) {
  const db = readAll();
  mutator(db);
  writeAll(db);
  return db;
}

export function resetDb() {
  localStorage.removeItem(NAMESPACE);
  return seed();
}

// Simulated network latency so loading states feel real.
export function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
