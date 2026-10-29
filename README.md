# Tribe Green — Corporate Gifting

Tribe Green is a corporate gifting catalogue and enquiry platform with a responsive website, a React Native mobile app, and a protected admin portal. The website and mobile app use the same Next.js API and PostgreSQL database for submitted enquiries. The mobile app also keeps a local copy of the enquiries submitted from that device so they remain visible in **My gifts**.

## Contents

- [Product capabilities](#product-capabilities)
- [Technology stack](#technology-stack)
- [Architecture and request flow](#architecture-and-request-flow)
- [Repository layout](#repository-layout)
- [Configuration](#configuration)
- [Run locally](#run-locally)
- [Build the Android app](#build-the-android-app)
- [Deploy](#deploy)
- [Security and operational notes](#security-and-operational-notes)

## Product capabilities

- Browse, search, and filter the gift catalogue by category, occasion, and budget.
- Open product details and start an enquiry with the selected product prefilled.
- Submit an enquiry from either the website or Android app, including contact details, quantity, budget, customisations, and a gift message.
- Review enquiries in the admin portal, change their status, and export enquiry data as CSV.
- Review locally cached mobile submissions in **My gifts**. This is a device-local history, not a synced customer account or an admin view.

## Technology stack

| Area | Technologies |
| --- | --- |
| Website and admin UI | Next.js 14 App Router, React 18, TypeScript, CSS, Lucide React |
| API | Next.js route handlers, Node.js runtime, PostgreSQL driver (`pg`) |
| Database | PostgreSQL; schema in `web/supabase/schema.sql` |
| Mobile app | React Native 0.76, Expo SDK 52, TypeScript, AsyncStorage, Expo Vector Icons |
| Android | Native Android project generated with Expo prebuild; package `com.tribegreen.gifting` |
| Hosting/build | Website/API can be deployed as a Next.js app (for example, Vercel); Android builds can use local Android tooling or EAS Build |

The website and mobile catalogue data are intentionally maintained in separate files (`web/data/catalogue.ts` and `mobile/data/catalogue.ts`). Keep their products and filter values aligned when editing the catalogue.

## Architecture and request flow

```text
Website (Next.js) ─────┐
                       ├─ POST /api/enquiries ─> Next.js API ─> PostgreSQL
Mobile app (Expo) ─────┘                               ▲
                                                      │
Admin portal ── session check/login ── GET/PATCH ─────┘
       │
       └── CSV export from the loaded admin enquiry data

Mobile app ── AsyncStorage: local copy for “My gifts” on this device
```

### Website

The Next.js app in `web/` serves the public catalogue, product pages, enquiry page, admin UI, and API from the same origin. Website forms send a JSON `POST` to `/api/enquiries`; relative URLs mean the browser uses the current website host. Product links can pass a product slug as `?product=...` to preselect it on the enquiry form.

### Mobile app

The Expo app in `mobile/` contains its own screens and catalogue. It sends JSON to `${EXPO_PUBLIC_API_URL}/api/enquiries`. The API base URL is normalized to remove trailing slashes, so configure the origin only (for example, `https://tribegreen.vercel.app`), without an `/api` suffix. On successful submission, the API response is saved to the app's AsyncStorage history. That cache is private to the app installation and is not a replacement for the central database.

### API and database

`web/app/api/enquiries/route.ts` validates public submissions, adds the source (`Website` or `Mobile app`), and writes them into `public.enquiries`. The same route exposes admin-only `GET` (list) and `PATCH` (status update) operations. The table stores the contact and gift request fields, source, status, and creation time. The schema is defined in `web/supabase/schema.sql`; the server also creates the table and adds the gift-message column on first use when its database role has the required permissions.

The public `POST` and its `OPTIONS` preflight allow cross-origin requests for mobile clients. Admin data operations are protected and are not made public by this CORS handling.

### Admin authentication

The admin page checks `/api/admin/session` on load and displays the authenticated view when a valid session exists. Login compares both submitted values exactly with `ADMIN_USERNAME` and `ADMIN_PASSWORD`; there is no fallback credential. The server sets a signed, HTTP-only, eight-hour cookie. Admin enquiry list and status requests validate this cookie on the server. Configure `ADMIN_SESSION_SECRET` to sign the cookie (the implementation can use `DATABASE_URL` as a fallback secret if omitted).

## Repository layout

```text
.
├── README.md
├── web/
│   ├── app/                 # Next.js pages and API route handlers
│   │   ├── admin/           # Admin portal
│   │   ├── api/             # Enquiry and admin session APIs
│   │   ├── enquire/         # Public enquiry page
│   │   └── products/        # Product detail route
│   ├── components/          # Layout, catalogue, enquiry, and admin UI
│   ├── data/catalogue.ts    # Website catalogue data
│   ├── lib/                  # PostgreSQL connection and auth helpers
│   └── supabase/schema.sql  # PostgreSQL schema
└── mobile/
    ├── App.tsx               # App state, navigation, API submission, local cache
    ├── components/           # Shared mobile UI components
    ├── screens/              # Discover, product, enquiry, and confirmation screens
    ├── data/catalogue.ts     # Mobile catalogue data
    ├── assets/               # App icon assets
    └── app.json              # Expo app and Android configuration
```

## Configuration

### Website/API environment

Copy `web/.env.example` to `web/.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Server-side only; never expose it to the browser or mobile app. |
| `ADMIN_USERNAME` | Exact username accepted by admin login. |
| `ADMIN_PASSWORD` | Exact password accepted by admin login. Use a strong, unique value. |
| `ADMIN_SESSION_SECRET` | Long random secret used to sign admin sessions. Set explicitly in deployed environments. |
| `NEXT_PUBLIC_SITE_URL` | Public website origin, used where an absolute site URL is needed. |

Keep real `.env` files out of source control. `.env.example` contains placeholders only.

### Mobile environment

Copy `mobile/.env.example` to `mobile/.env` and set `EXPO_PUBLIC_API_URL` to the **origin** of the running/deployed Next.js website, for example:

```env
EXPO_PUBLIC_API_URL=https://tribegreen.vercel.app
```

Local development URLs depend on where the app runs:

| Client | API URL example |
| --- | --- |
| Browser on the same computer | `http://localhost:3000` |
| Android emulator | `http://10.0.2.2:3000` |
| Physical phone on the same Wi-Fi | `http://<computer-LAN-IP>:3000` |
| Installed app outside your local network | Deployed HTTPS website origin |

`localhost` inside a phone refers to the phone itself, so it cannot reach a development server on your computer. The computer firewall must also permit the phone to connect to the development port.

## Run locally

Requirements: Node.js 22 or newer; PostgreSQL for saving enquiries; Android Studio/SDK and a connected Android device or emulator for local native Android runs.

### Start the website and API

```bash
cd web
npm install
```

Set up `web/.env.local` as described above. Apply the schema to the configured database (or ensure the database user can create/alter the table, allowing the API's startup schema initialization):

```bash
# Run web/supabase/schema.sql against the PostgreSQL database in DATABASE_URL
```

Then start Next.js:

```bash
npm run dev
```

Visit `http://localhost:3000`. Public routes include `/`, `/products/copper-bottle`, and `/enquire`; the admin portal is `/admin`.

### Start the Expo app

In another terminal:

```bash
cd mobile
npm install
```

Set `mobile/.env` and start Expo:

```bash
npm start
```

For a native Android development build, connect a phone with USB debugging enabled or start an emulator, confirm it appears in `adb devices`, then run:

```bash
npm run android
```

Expo may choose a detected emulator when one is running. The app's API URL still needs to be reachable from the chosen device as described in [Mobile environment](#mobile-environment).

## Build the Android app

The Expo configuration sets the Android package ID to `com.tribegreen.gifting`. For an installable internal APK using EAS:

```bash
cd mobile
npx eas-cli build --platform android --profile preview
```

Configure `EXPO_PUBLIC_API_URL` in the EAS build environment before building. The APK embeds that value, so changing it requires a new build. To install a local APK, use the build artifact from EAS or the Android Gradle build output. Android will reject an update if an already-installed app has the same package ID but was signed with a different key; uninstall that old installation before installing the differently signed build. Uninstalling removes the app's local AsyncStorage history.

## Deploy

1. Create/provision PostgreSQL and apply `web/supabase/schema.sql` (or give the configured DB user the permissions needed for automatic initialization).
2. Deploy `web/` as the Next.js project root. Set `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the hosting provider. Set `NEXT_PUBLIC_SITE_URL` to the deployed website origin if needed.
3. Set the EAS environment variable `EXPO_PUBLIC_API_URL` to that same website origin, with no trailing slash or `/api` path, then create the Android build.
4. Submit a website enquiry and a mobile enquiry; verify both appear in `/admin` and can be updated there.

## Security and operational notes

- Never put database credentials or admin secrets in `EXPO_PUBLIC_*` variables or mobile source. Expo public variables are compiled into the app and are not secret.
- Admin authentication is a single environment-configured credential pair, not individual user accounts or role-based access control.
- Mobile **My gifts** is a local cache. Reinstalling/clearing app data deletes that history; the central copy remains in PostgreSQL for the admin portal.
- Product images currently reference remote Unsplash URLs and need an internet connection.
- Rotate admin credentials and session secret if they have been exposed; changing credentials invalidates previously signed sessions.
