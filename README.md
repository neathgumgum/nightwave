# NightWave

React + Vite + Tailwind CSS v4 + Firebase (Auth + Firestore) storefront.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your Firebase project's config values
npm run dev
```

Open http://localhost:5173

## Admin access (important — changed from the original spec)

In the original version, **any logged-in user** could open `/admin` and edit or
delete products. This version locks that down with a Firebase **custom claim**
called `admin`, checked in two places:

1. **Client-side** (`App.jsx` / `ProtectedRoute.jsx`) — hides the Admin link and
   blocks the `/admin` route unless `admin: true` is set on the user's ID token.
2. **Server-side** (`firestore.rules`) — Firestore itself rejects writes to
   `products` unless the request's auth token carries `admin: true`. This is the
   part that actually matters for security; the client-side check is just UX.

Custom claims can't be set from client code (by design). Set one from a trusted
environment — a Cloud Function, a script using the Admin SDK, or the Firebase
CLI with a small Node script:

```js
// run once, from a Node script with the Firebase Admin SDK, not in the browser
const admin = require("firebase-admin");
admin.initializeApp();

await admin.auth().setCustomUserClaims("<uid-of-your-admin-user>", { admin: true });
```

After setting the claim, the user needs to sign out/in once (or the app will
pick it up automatically on next load, since `App.jsx` forces a fresh token).

Deploy the rules with:

```bash
firebase deploy --only firestore:rules
```

## Cart & orders

- **Add to Cart / Buy Now** on every product card. Cart state lives in
  `src/context/CartContext.jsx` and persists to `localStorage`, so it survives
  a page refresh.
- **`/cart`** shows line items, lets you adjust quantity or remove items, and
  has a Checkout button.
- **Checkout requires login.** If you're not signed in, Checkout sends you to
  `/login` and brings you back to `/cart` afterward (same pattern as the
  admin-route redirect).
- A successful checkout writes one document to a Firestore **`orders`**
  collection: `{ userId, userEmail, items, total, status: "pending", createdAt }`.
- **Admin → Orders tab** now lists every order (name, total, line items) and
  lets an admin change status (`pending` / `shipped` / `completed` /
  `cancelled`) via a dropdown, instead of the placeholder text it showed
  before.
- `firestore.rules` was extended to cover `orders`: a signed-in user can
  create an order for themselves and read their own orders; only an account
  with the `admin` custom claim can read every order or change its status.
  Redeploy the rules after pulling this change:
  ```bash
  firebase deploy --only firestore:rules
  ```

## Notes vs. the original spec

- Delete-product now asks for confirmation before removing anything.
- The product form validates that ID/name are present and price is a
  non-negative number before saving.
- New registrations land on `/` instead of `/admin` — signing up no longer
  implies admin access.
- Product images go in `public/images/...` (not `src/`) so Vite serves them
  as static assets — the paths in `src/data/products.js` already assume this.
