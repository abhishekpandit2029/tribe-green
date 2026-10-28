# Tribe Green · Corporate gifting

A small gifting catalogue and enquiry experience built as two independent apps. The web app is Next.js; the Android app is React Native with Expo. Each app owns its product data in `web/data/catalogue.ts` and `mobile/data/catalogue.ts`. Enquiries from both apps are sent to the same Next.js API and stored in PostgreSQL.

## Run locally

**Website/API** (Node 22+):

```bash
cd web
npm install
```

Set `DATABASE_URL` to your PostgreSQL connection string, run [`web/supabase/schema.sql`](web/supabase/schema.sql) against that database, and copy `web/.env.example` to `web/.env.local`. Set both `ADMIN_USERNAME` and `ADMIN_PASSWORD` to your chosen credentials, and set a long random session secret. Keep `DATABASE_URL` server-side. Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000`. The catalogue is `/`, a product detail is `/products/copper-bottle`, enquiry form is `/enquire`, and the admin portal is `/admin`. Admin login requires the exact `ADMIN_USERNAME` and `ADMIN_PASSWORD` values configured in the server environment (for local development, `web/.env.local`).

## Deploy and connect both apps

Deploy the `web/` directory as a Next.js project (for example, set Vercel's project root to `web`) and add the variables from `web/.env.example` to the hosting environment. Run the SQL schema once in PostgreSQL. Website and app forms both `POST /api/enquiries`; the API saves rows to PostgreSQL, and `/admin` reads and updates those same rows. There is no direct database connection or secret key in the mobile binary.

Set `EXPO_PUBLIC_API_URL` to the deployed website origin in the EAS environment before building the app. For local Android emulator use `http://10.0.2.2:3000`; for a physical phone use the computer's LAN IP and port. The catalogue is intentionally copied into each app, while enquiry records go to the common API.

**Android app** (Node 22+, Android Studio or EAS Build):

```bash
cd mobile
npm install
npm start
```

Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL` to the deployed Next.js URL (or your LAN-accessible local URL). Build/run Android with:

```bash
npm run android
```

The project targets Android package `com.tribegreen.gifting`. After deploying the website and setting `EXPO_PUBLIC_API_URL` in the EAS project environment, `eas build --platform android --profile preview` creates an installable APK.

## Stack and implementation

- **Next.js / React / TypeScript** for responsive catalogue, product pages, enquiry form, API, and admin route.
- **React Native / Expo / TypeScript** for a dedicated Android app with Discover, product detail, enquiry form, and My Enquiries screens.
- **Separate TypeScript catalogues** in `web/data/catalogue.ts` and `mobile/data/catalogue.ts` each provide the same 9 products and filter values.
- The Next.js API validates and saves website and mobile enquiries to one PostgreSQL table. The admin route reads that same table, changes statuses, and exports CSV. Mobile also caches its own submitted enquiries in AsyncStorage for the “My enquiries” view.
- Admin login accepts only the configured `ADMIN_USERNAME` and `ADMIN_PASSWORD`; it is disabled if either value is missing. Admin session cookies are HTTP-only and signed using `ADMIN_SESSION_SECRET` (or `DATABASE_URL`), with the configured credentials bound to the session signature.

## What I would improve

With more time, I would add managed admin accounts, request throttling and spam protection, image assets hosted with the app, accessibility review, automated tests, and a deployment pipeline. Change the demo admin password before exposing the deployment publicly.

## Incomplete deliverables

The source includes the website/API and Expo Android app. A PostgreSQL database, live deployment, compiled APK, and screen recording still need to be produced and linked before submission. Product photos are loaded from Unsplash URLs and therefore require internet access.

## Time spent

To be filled in by the candidate before handover.
