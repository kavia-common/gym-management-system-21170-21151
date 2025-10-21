# Gym Frontend App

React frontend for the Gym Management System. Implements routing, authentication, dashboard sections, and API integration with the backend.

---

## Runtime Configuration

This app supports loading configuration values at runtime (without rebuild) via `public/app-config.json`.

- At startup, `src/config/runtimeConfig.js` loads `/app-config.json` and sets `window.__APP_CONFIG__`.
- The API base URL (`API_BASE_URL`) and Google Client ID (`GOOGLE_CLIENT_ID`) are consumed from this runtime config if set.
- If not defined, a fallback to the corresponding `.env` variables (`REACT_APP_API_BASE_URL`, `REACT_APP_GOOGLE_CLIENT_ID`) is used.
- Supabase config can also be provided here:
  ```json
  {
    "SUPABASE_URL": "https://xxxx.supabase.co",
    "SUPABASE_KEY": "public-anon-key"
  }
  ```

**To change API endpoint or Google login for a preview/deployment without rebuilding:**

1. Edit `public/app-config.json` and update the relevant values:
   ```json
   {
     "API_BASE_URL": "https://your-api-url/api/v1",
     "GOOGLE_CLIENT_ID": "your-google-client-id",
     "SUPABASE_URL": "https://xxxx.supabase.co",
     "SUPABASE_KEY": "public-anon-key"
   }
   ```
2. Reload the app in the browser.

> If `GOOGLE_CLIENT_ID` is missing, the Login screen will display a message and hide the Google sign-in button.

---

## Features

- Ocean Professional theme (classic, responsive dashboard)
- Routing with react-router-dom
- Authentication:
  - Existing backend JWT flows (legacy) remain in code, but
  - New Supabase email/password auth via `@supabase/supabase-js`
- Protected dashboard pages
- API client with axios:
  - Base URL from `REACT_APP_API_BASE_URL` (default `http://localhost:3001/api/v1`)
  - Authorization header injection available via `src/api/client.ts` (`fetchWithAuth`)
  - 401 handling redirects to sign-in
- Pages
  - /signin, /signup
  - /dashboard (overview)
  - /dashboard/memberships
  - /dashboard/classes
  - /dashboard/trainers
  - /dashboard/bookings
  - /checkout/result

## Getting Started

1. Copy `.env.example` to `.env` and adjust values as needed.
2. Install dependencies:
   - `npm install`
3. Start the app:
   - `npm start`
   - The app runs on `http://localhost:3000` (port can be overridden via PORT env).

Ensure the backend is running and accessible at the URL configured in `REACT_APP_API_BASE_URL`.

If backend routes change, ensure the backend OpenAPI is regenerated:
- In `gym_backend_api`: `python -m src.api.generate_openapi` (writes to `interfaces/openapi.json`)

## Environment Variables

See `.env.example` for all variables:
- `PORT` (default 3000)
- `REACT_APP_API_BASE_URL` (e.g., `http://localhost:3001/api/v1`)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` (optional)
- `REACT_APP_APP_ENV` (dev|staging|prod label shown in navbar)
- `REACT_APP_TEST_MODE` (true/false for mock/test flows)
- `REACT_APP_GOOGLE_CLIENT_ID` (enable Google Sign-In button and One Tap)
- `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` to enable Supabase auth
- `REACT_APP_SITE_URL` used for Supabase email redirect on signup

## Notes

- Supabase session is stored by `@supabase/supabase-js` and exposed via `AuthContext`.
- On sign out, ProtectedRoute redirects to `/signin`.
- CRUD actions are basic and aligned with the backend OpenAPI spec provided.
