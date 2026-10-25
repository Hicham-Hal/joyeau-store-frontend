# Joyau Brillant Boutique — quick guide

## Change the photos of the home page
Edit **`src/data/siteImages.js`** (all explained inside):
- `HERO_IMAGES`   → the big photos at the top. Put your files in `public/images/hero/`.
- `UNIVERS_DRESSES` → the 3 dresses of "Notre univers en images" (mixed with the fabric pictures).
  Put your files in `public/images/univers/`.

Tip: shrink photos before adding them (about 1080 px wide, under 200 KB each) so the site stays fast on mobile data.

## Fonts
Loaded from Google Fonts in `index.html`. Brand name: Pinyon Script (same style as the logo),
titles: Cormorant Garamond, text: Jost. Arabic: El Messiri (titles) and Tajawal (text).
Colors and font names are defined at the top of `src/index.css`.

## What the seller can do in the dashboard (`/#/espace-vendeur`)
- **Collections**: add / rename / delete the types of dresses (a collection with dresses cannot be deleted).
- **Produits**: photos and video uploaded from phone or PC (or a URL); each color has its own name + photo/video.
- **Galerie**: add pictures / videos (upload or URL).
- **Commandes**: tabs "Non payées", "Via la poste" (check the receipt, confirm or refuse), "En ligne", "Refusées".
- **Tableau de bord**: tap "Total / En attente / Confirmées / Refusées" to see the list.
- **Livraison**: change the Yalidine delivery price of each wilaya (or one price for all).

## Customer order flow
1. Choose a dress → size, color (the picture changes with the color), optional body description → cart.
2. Fill the information → **Envoyer ma commande** → the order arrives as *non payée*.
3. Last step *Acompte de confirmation*: pay online (automatically confirmed) or via la poste (the seller confirms).

## Run it
```
npm install
npm run dev
```
Demo mode needs no server. To use a real backend see `API_CONTRACT.md` and `.env.example`.
