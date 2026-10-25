// ---------------------------------------------------------------------------
// Product helpers.
//
// A color is { name, url, type }:
//   name -> "Bleu roi"
//   url  -> picture or video of the dress in THIS color ("" if none)
//   type -> "image" | "video"
// Older data stored colors as plain strings ("Blanc"): normalizeProduct() converts them.
// ---------------------------------------------------------------------------

export function normalizeColors(colors) {
  return (colors || [])
    .map((c) =>
      typeof c === "string"
        ? { name: c, url: "", type: "image" }
        : { name: c?.name || "", url: c?.url || "", type: c?.type === "video" ? "video" : "image" }
    )
    .filter((c) => c.name);
}

export function normalizeProduct(product) {
  if (!product) return product;
  return {
    ...product,
    colors: normalizeColors(product.colors),
    sizes: product.sizes || [],
    images: product.images || [],
  };
}

export function normalizeProducts(list) {
  return Array.isArray(list) ? list.map(normalizeProduct) : [];
}

// "Robes de Mariée" -> "robes-de-mariee"
export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
