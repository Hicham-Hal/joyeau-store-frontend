# Backend API contract (Joyau Brillant Boutique)

The front end talks to the backend through **Redux Toolkit thunks** (`src/store/slices/*`),
which call the **service functions** (`src/services/*`), which use the Axios client
(`src/api/axiosClient.js`). If your backend differs from this file, change only
`src/services/*` – no component needs to be touched.

## Switching from the demo data to the real backend

Copy `.env.example` to `.env`:

```
VITE_USE_MOCK=false
VITE_API_URL=https://your-backend.example.com/api
```

With `VITE_USE_MOCK=true` (the default) the app runs on localStorage demo data, no server needed.

## Conventions

- JSON in, JSON out. Plain objects/arrays (no `{ data: ... }` envelope). Exception: uploads (multipart).
- `id` can be a number or a string.
- Seller routes are called with `Authorization: Bearer <token>`.
  If one answers **401**, the app logs the seller out.
- Errors: any non-2xx status. If the body has a `message` field it is kept in the Redux state.
- **The backend must recompute prices** (products total, delivery price from `/delivery-prices`,
  total) when it creates an order: the numbers sent by the browser are only a convenience.

## Endpoints

| Method | Path | Access | Body | Response |
|---|---|---|---|---|
| POST | `/auth/login` | public | `{ username, password }` | `{ token, user }` (401/400 = wrong credentials) |
| GET | `/products` | public | | `Product[]` |
| GET | `/products/:id` | public | | `Product` (**404** when missing) |
| POST | `/products` | seller | `Product` without `id` | created `Product` (with `id`) |
| PUT | `/products/:id` | seller | `Product` fields | updated `Product` |
| DELETE | `/products/:id` | seller | | any 2xx |
| GET | `/categories` | public | | `Category[]` (the "Collections") |
| POST | `/categories` | seller | `{ fr, ar, image }` | created `Category` (backend creates the `id`) |
| PUT | `/categories/:id` | seller | `{ fr, ar, image }` | updated `Category` |
| DELETE | `/categories/:id` | seller | | any 2xx — **409** if products still use it |
| GET | `/delivery-prices` | public | | `{ "01": { home, stopdesk }, ... }` (one entry per wilaya code) |
| PUT | `/delivery-prices` | seller | the whole object above | the saved object (or empty) |
| POST | `/uploads` | seller (and customers for receipts) | `multipart/form-data`, field `file` | `{ url }` |
| GET | `/gallery?placement=` | public | | `GalleryItem[]` (`placement` optional) |
| POST | `/gallery` | seller | `{ url, type, placement }` | created `GalleryItem` |
| DELETE | `/gallery/:id` | seller | | any 2xx |
| POST | `/orders` | public | `Order` payload (below) | created order, status **`unpaid`**, **must include `id` and `orderNumber`** |
| POST | `/orders/:id/payment` | public | `{ paymentMethod, deposit, receiptImage? }` | updated `Order` (below) |
| GET | `/orders` | seller | | `Order[]` |
| PATCH | `/orders/:id` | seller | `{ status }` | updated `Order` (or empty) |
| POST | `/messages` | public | `{ name, phone, message }` | created `Message` |
| GET | `/messages` | seller | | `Message[]` |
| PATCH | `/messages/:id` | seller | `{ read: true }` | any 2xx |
| DELETE | `/messages/:id` | seller | | any 2xx |
| GET | `/store/status` | public | | `{ open: boolean }` |
| PUT | `/store/status` | seller | `{ open: boolean }` | any 2xx |

## Order life cycle (two steps)

1. **Customer fills her information and clicks "Envoyer ma commande"** → `POST /orders`.
   The order is created with status **`unpaid`** (it appears in the dashboard tab "Non payées").
2. **Last step, "acompte de confirmation"** (1000 / 1500 / 2000 DZD) → `POST /orders/:id/payment`:
   - `paymentMethod: "online"` → the backend marks the order **`confirmed`** automatically
     (in production only after SofizPay confirms the payment, see "Not covered yet").
   - `paymentMethod: "post"` + `receiptImage` (url from `/uploads`) → status **`pending`**:
     the seller checks the receipt and confirms by hand.
3. The seller can then `PATCH /orders/:id` with `{ status: "confirmed" | "refused" | "pending" | "unpaid" }`.

Statuses: `unpaid` · `pending` · `confirmed` · `refused`.

`POST /orders/:id/payment` is public: the backend should accept it only for an order that is
still `unpaid` (and ideally check the order number / phone), never for another customer's order.

## Shapes

```jsonc
// Product — each color has its own picture OR video (shown when the customer taps the color)
{ "id": 1, "category": "<Category.id>",
  "name": { "fr": "...", "ar": "..." }, "description": { "fr": "...", "ar": "..." },
  "price": 12000, "oldPrice": null, "prepDays": 7,
  "sizes": ["36", "38"],
  "colors": [ { "name": "Bleu roi", "url": "https://...", "type": "image | video" } ],
  "images": ["https://..."], "video": "",
  "isBestSeller": false, "isNew": true, "stock": true, "createdAt": 1735689600000 }
// (older data with colors as plain strings, e.g. ["Blanc"], is still accepted by the front end)

// Category (a "Collection" = a type of dresses, edited by the seller)
{ "id": "mariage", "fr": "Robes de Mariée", "ar": "فساتين الزفاف", "image": "https://..." }

// GalleryItem
{ "id": 1, "url": "https://...", "type": "image | video",
  "placement": "home | best | new | about", "createdAt": 1735689600000 }

// Order — what POST /orders receives (the backend adds id, orderNumber, createdAt)
{ "items": [{ "key": "1__38__Bleu roi__", "productId": 1, "name": { "fr": "", "ar": "" },
              "image": "https://...", "price": 12000, "prepDays": 7,
              "size": "38", "color": "Bleu roi", "quantity": 1,
              "bodyNote": "1m65, 60 kg, poitrine 92 cm..." }],   // free text written by the customer
  "customer": { "firstName": "", "lastName": "", "phone": "0555123456", "wilaya": "", "wilayaCode": "05",
                "commune": "", "deliveryType": "home | stopdesk" },
  "deliveryCompany": "Yalidine", "productsTotal": 12000, "deliveryPrice": 600, "totalDue": 12600,
  "status": "unpaid", "paid": false }

// Order — after step 2 the same order also has
{ "paymentMethod": "online | post", "deposit": 1000, "receiptImage": "https://... | null",
  "paid": true, "status": "confirmed | pending", "paidAt": 1735689600000 }

// Message (the backend adds id, read, createdAt)
{ "id": 1, "name": "", "phone": "", "message": "", "read": false, "createdAt": 1735689600000 }
```

## Not covered yet

- **Online payment (SofizPay):** `src/services/paymentService.js` is still a simulation and the
  card form of the payment page is a demo. The real flow (create the payment on the backend,
  redirect to SofizPay, confirm the order from the webhook) must be defined with the backend.
  The browser must never receive or send card numbers in production.
- **Demo-mode limits:** with `VITE_USE_MOCK=true` uploaded pictures are shrunk and kept in the
  browser (a few dozen pictures at most) and uploaded videos are limited to 3 MB.
  With a real backend (`POST /uploads`) there is no such limit.
