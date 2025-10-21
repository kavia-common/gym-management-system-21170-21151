Trainer Workouts UI

- Templates.jsx
  - CRUD Exercises at /api/v1/workouts/exercises
  - CRUD Templates at /api/v1/workouts/templates
  - Uses fetchWithAuth for Supabase-protected endpoints
  - Graceful fallbacks with helper messages

- ProgramBuilder.jsx
  - Lists templates and trainer's clients
  - Create program from template: POST /api/v1/workouts/programs
  - Generate days for a program: POST /api/v1/workouts/programs/{id}/days
  - Lists programs for selected member via GET /api/v1/workouts/programs?member_id=...

Routes:
- /dashboard/trainer/workouts/templates
- /dashboard/trainer/workouts/program-builder

Both routes are behind ProtectedRoute with allowedRoles=['trainer'] and links appear in Sidebar "Trainer" section.
