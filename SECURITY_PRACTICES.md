# Security Practices

This document summarizes the security practices used during development.

## Authentication & Session Handling
- JWT-based authentication with HttpOnly cookies.
- Auth middleware protects user-specific routes.
- Only the authenticated user can access their own journal entries.

## Data Protection & Validation
- Passwords are hashed with bcrypt before storage.
- Server-side input validation for auth and journal endpoints.
- Mongoose schema validation (type checks, min/max, enums).

## API Key Safety
- Gemini and TMDB API keys are kept on the backend in `.env`.
- Frontend only uses `VITE_TMDB_TOKEN` if the Home page calls TMDB directly.
- API keys are never committed to source control.

## Access Control
- Journal queries are always scoped by `user` in the database.
- Updates/deletes are restricted to the owner’s entries.

## Error Handling
- Backend returns generic error messages to avoid leaking sensitive details.
- Logs are kept server-side.

## CORS
- CORS is restricted to the frontend origin (`CLIENT_ORIGIN`).

## Dependencies
- Uses well-known libraries (Express, Mongoose, bcrypt, jsonwebtoken).
- Keep dependencies updated and avoid unused packages.
