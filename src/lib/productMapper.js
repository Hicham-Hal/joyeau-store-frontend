// src/lib/productMapper.js
// Converts between the backend model names and the names your frontend already uses.

// API -> frontend (apply when you RECEIVE products)
export const fromApi = (p) => ({
  ...p,
  id: p._id,
  prepDays: p.preparationDays,
  isNew: p.isNewArrival,
  stock: p.inStock,
  images: p.images || [],
  colors: (p.colors || []).map((c) => ({
    id: c._id,
    name: c.name,
    url: c.mediaUrl,
    type: c.mediaType,
  })),
});

// frontend -> API (apply when you SEND a product)
export const toApi = (p) => ({
  category: p.category,
  name: p.name,
  price: p.price,
  preparationDays: p.prepDays,
  sizes: p.sizes,
  images: p.images,
  video: p.video,
  colors: p.colors.map((c) => ({
    name: c.name,
    mediaUrl: c.url,
    mediaType: c.type,
  })),
  description: p.description,
  isBestSeller: p.isBestSeller,
  isNewArrival: p.isNew,
  inStock: p.stock,
});