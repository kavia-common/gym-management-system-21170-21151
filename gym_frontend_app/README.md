# Gym Frontend App

React frontend for the Gym Management System. Implements routing, authentication, dashboard sections, and API integration with the backend.

## Features

- Ocean Professional theme (classic, responsive dashboard)
- Routing with react-router-dom
- Authentication (login, signup, logout, Google Sign-In)
- Protected dashboard pages
- API client with axios:
  - Base URL from `REACT_APP_API_BASE_URL` (default `http://localhost:3001/api/v1`)
  - JWT Authorization header from stored tokens
  - 401 handling redirects to `/login`
- Pages
  - /login, /signup
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

## Google Sign-In (GIS) Setup

This app uses Google Identity Services (GIS) for "Continue with Google" and One Tap login.

1. Create OAuth Client ID:
   - Go to Google Cloud Console → APIs & Services → Credentials.
   - Create Credentials → OAuth client ID → Application type: Web application.
   - Add Authorized JavaScript origins:
     - http://localhost:3000 (for local dev)
     - Your deployed frontend URL(s)
   - Copy the Client ID.

2. Configure frontend:
   - Set `REACT_APP_GOOGLE_CLIENT_ID` in `.env` to your client ID.
   - Restart the dev server if already running.

3. Backend endpoint:
   - The frontend will POST the credential (Google ID token) to:
     - `POST /api/v1/auth/google/one-tap` with body `{ "credential": "<ID_TOKEN>" }`
   - The backend should verify the ID token, create/find the user, and return app JWTs:
     - Response shape should match `TokenPair` (access_token, refresh_token, token_type).

4. Behavior:
   - On the Login page, the Google button will render if `REACT_APP_GOOGLE_CLIENT_ID` is set.
   - On credential success, the app stores the tokens and redirects to `/dashboard`.

## Notes

- Tokens are stored in memory and `localStorage` (key: `gym.tokens`).
- On 401 responses, tokens are cleared and the app redirects to `/login`.
- CRUD actions are basic and aligned with the backend OpenAPI spec provided.
