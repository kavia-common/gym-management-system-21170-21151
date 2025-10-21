# Gym Frontend App

React frontend for the Gym Management System. Implements routing, authentication, dashboard sections, and API integration with the backend.

## Features

- Ocean Professional theme (classic, responsive dashboard)
- Routing with react-router-dom
- Authentication (login, signup, logout)
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

## Environment Variables

See `.env.example` for all variables:
- `PORT` (default 3000)
- `REACT_APP_API_BASE_URL` (e.g., `http://localhost:3001/api/v1`)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` (optional)
- `REACT_APP_APP_ENV` (dev|staging|prod label shown in navbar)
- `REACT_APP_TEST_MODE` (true/false for mock/test flows)

## Notes

- Tokens are stored in memory and `localStorage` (key: `gym.tokens`).
- On 401 responses, tokens are cleared and the app redirects to `/login`.
- CRUD actions are basic and aligned with the backend OpenAPI spec provided.
