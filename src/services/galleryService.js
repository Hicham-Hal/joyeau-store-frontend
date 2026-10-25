import axiosClient, { USE_MOCK } from "../api/axiosClient";
import { getDb, updateDb, delay } from "./mockDb";

// Backend contract:
//   GET    /gallery?placement=home|best|new|about  -> GalleryItem[]   (placement optional)
//   POST   /gallery                                -> GalleryItem     (the created item)
//   DELETE /gallery/:id                            -> any 2xx

export async function fetchGallery(placement) {
  if (USE_MOCK) {
    await delay(300);
    const all = getDb().gallery;
    return placement ? all.filter((g) => g.placement === placement) : all;
  }
  const { data } = await axiosClient.get("/gallery", { params: placement ? { placement } : undefined });
  return data;
}

export async function addGalleryItem(payload) {
  if (USE_MOCK) {
    await delay(400);
    let created;
    updateDb((db) => {
      const maxId = db.gallery.reduce((m, g) => Math.max(m, g.id), 0);
      created = { ...payload, id: maxId + 1, createdAt: Date.now() };
      db.gallery.unshift(created);
    });
    return created;
  }
  const { data } = await axiosClient.post("/gallery", payload);
  return data;
}

export async function deleteGalleryItem(id) {
  if (USE_MOCK) {
    await delay(300);
    updateDb((db) => {
      db.gallery = db.gallery.filter((g) => g.id !== Number(id));
    });
    return true;
  }
  await axiosClient.delete(`/gallery/${id}`);
  return true;
}
