Trainer Workouts UI

- Templates.jsx
  - CRUD Exercises at /api/v1/workouts/exercises
  - CRUD Templates at /api/v1/workouts/templates
  - Uses fetchWithAuth for Supabase-protected endpoints
  - Graceful fallbacks with helper messages
  - Ocean Professional theme components: cards, buttons, inputs with helper/error text
  - Loading, error, and empty states included

- ProgramBuilder.jsx
  - Lists templates and trainer's clients
  - Create program from template: POST /api/v1/workouts/programs
  - Generate days for a program: POST /api/v1/workouts/programs/{id}/days
  - Lists programs for selected member via GET /api/v1/workouts/programs?member_id=...
  - Loading, error, and empty states included for templates, clients, and programs
  - All actions protected by Supabase bearer auth

Routes:
- /dashboard/trainer/workouts/templates
- /dashboard/trainer/workouts/program-builder

Both routes are behind ProtectedRoute with allowedRoles=['trainer'] and links appear in Sidebar "Trainer" section.
