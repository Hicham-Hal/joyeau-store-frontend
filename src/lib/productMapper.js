// API -> frontend
export const fromApi = (p) => ({
  ...p,
  id: p._id ?? p.id,
  name: {
    fr: p.name?.fr || p.title || "",
    ar: p.name?.ar || p.name?.fr || p.title || "",
  },
  description: {
    fr: p.description?.fr || (typeof p.description === "string" ? p.description : ""),
    ar: p.description?.ar || p.description?.fr || "",
  },
  prepDays: p.preparationDays ?? 0,
  isNew: !!p.isNewArrival,
  stock: p.inStock !== false,
  oldPrice: p.oldPrice ?? null,
  createdAt: p.createdAt ? new Date(p.createdAt).getTime() : 0,
  images: p.images || [],
  colors: (p.colors || []).map((c) => ({
    id: c._id,
    name: c.name,
    url: c.mediaUrl || "",
    type: c.mediaType || "image",
  })),
});

// frontend -> API
export const toApi = (p) => ({
  category: p.category,
  categoryName: p.categoryName,
  name: p.name,
  price: p.price,
  preparationDays: p.prepDays,
  sizes: p.sizes,
  images: p.images,
  video: p.video || "",
  colors: (p.colors || []).map((c) => ({
    name: c.name,
    mediaUrl: c.url,
    mediaType: c.type,
  })),
  description: p.description,
  isBestSeller: p.isBestSeller,
  isNewArrival: p.isNew,
  inStock: p.stock,
});