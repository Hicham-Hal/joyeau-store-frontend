// ---------------------------------------------------------------------------
// Pictures used on the home page. Edit this file to use your own photos.
//
//  HERO_IMAGES  -> the big slideshow at the top of the home page.
//                  Put your photos in  public/images/hero/  and list them here.
//                  (portrait photos work best on phones, about 1080 px wide)
//
//  UNIVERS_DRESSES -> the 3 dress photos of "Notre univers en images".
//                  They are mixed with the fabric (tissu) pictures of the strip.
//                  Put your photos in  public/images/univers/  and list them here.
//
// Tip: compress photos before adding them (e.g. squoosh.app) so the site stays
// fast on mobile data.
// ---------------------------------------------------------------------------

export const HERO_IMAGES = [
  "/images/hero/hero-1.jpg",
  "/images/hero/hero-2.jpg",
  "/images/hero/hero-3.jpg",
];

// Which part of each hero photo stays visible when the screen is narrow
// (same order as HERO_IMAGES). "center 15%" keeps the face and the top of the dress.
export const HERO_POSITIONS = ["center 18%", "center 15%", "center 22%"];

export const UNIVERS_DRESSES = [
  "/images/univers/dress-blue.jpg",
  "/images/univers/dress-teal.jpg",
  "/images/univers/dress-white.jpg",
];
