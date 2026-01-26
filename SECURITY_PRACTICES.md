# Security Practices

This document summarizes the security practices used during development.

## Authentication and Session Handling
- JWT-based authentication is used for sessions.
- Tokens are set in HttpOnly cookies to reduce exposure to XSS.
- Cookies use SameSite=Lax and Secure in production.
- Auth middleware protects user-specific routes.

## Access Control
- Journal queries are always scoped to the authenticated user.
- Update and delete operations require ownership of the entry.

## Data Protection and Validation
- Passwords are hashed with bcrypt before storage.
- Server-side validation for auth and journal inputs.
- Mongoose schema validation (types, min/max, enums, required fields).

## API Key Safety
- Gemini and TMDB API keys live in server-side environment variables.
- Keys are never committed to source control.
- Frontend only uses `VITE_TMDB_TOKEN` as an optional fallback for local dev.

## Error Handling and Logging
- Backend returns generic error messages to avoid leaking details.
- Detailed errors are logged server-side.

## CORS
- CORS is restricted to the frontend origin (`CLIENT_ORIGIN`).

## Dependencies
- Uses well-known libraries (Express, Mongoose, bcrypt, jsonwebtoken).
- Dependencies should be kept updated.

## Known Limitations (MVP)
- No refresh-token rotation or forced logout on password change.
- No email verification or password reset flow.
- No global rate limiting or IP throttling.
