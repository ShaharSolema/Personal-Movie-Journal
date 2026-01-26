# Personal-Movie-Journal

## Description

Personal Movie Journal is a full-stack web app that lets users search movies via TMDB,
save them to a personal watch space, add ratings/comments, and mark favorites.
It also includes AI movie recommendations using Gemini.

## Features

- Authentication: sign up, login, logout, and current user session via JWT cookies
- Movie search and details (title, year, poster, IMDb rating)
- Personal watch space: Want to Watch, Watched, and Favorites
- Ratings and personal comments per movie
- Edit and delete journal entries
- Optional AI movie picks using Gemini

## Tech Stack

- Frontend: React, Vite, Axios, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- External APIs: TMDB, Google Gemini

## Setup & Run

### 1) Backend

```bash
cd apps/backend
npm install
```

Create `apps/backend/.env` with:

- `MONGODB_URI`
- `JWT_SECRET`
- `TMDB_TOKEN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)
- `CLIENT_ORIGIN` (optional)

Run the server:

```bash
npm run dev
```

Default port: `3000`

### 2) Frontend

```bash
cd apps/frontend
npm install
```

Create `apps/frontend/.env` with:

- `VITE_API_URL` (optional)
- `VITE_TMDB_TOKEN` (optional; only used if the backend is unavailable)

Run the client:

```bash
npm run dev
```

Default port: `5173`

## Integrated APIs

- **TMDB API** (movie search, details, recommendations, videos)
- **Google Gemini API** (AI movie picks)

## Environment Variables

Backend (`apps/backend/.env`):

- `MONGODB_URI`
- `JWT_SECRET`
- `TMDB_TOKEN` (TMDB API Read Access Token)
- `GEMINI_API_KEY` (Google Gemini API key)
- `GEMINI_MODEL` (optional, defaults to `gemini-2.0-flash`)
- `CLIENT_ORIGIN` (optional, defaults to `http://localhost:5173`)

Frontend (`apps/frontend/.env`):

- `VITE_API_URL` (optional, defaults to `http://localhost:3000/api`)
- `VITE_TMDB_TOKEN` (optional; only needed if the backend is unavailable)

## Limitations and Notes

- AI picks require a valid Gemini API key and are subject to provider quotas, rate limits,
  and potential usage costs. Results are non-deterministic and may change between runs.
- AI requests are cached briefly on the server to reduce API usage.
- If the backend is down, some pages can fall back to TMDB directly using
  `VITE_TMDB_TOKEN`. This is convenient for local development but not recommended
  for production because it exposes a token in the browser.
- There is no email verification or password reset flow in this MVP.
- There is no limit on how many requests a user can send per minute(global rate limiting).

## Security Practices

See `SECURITY_PRACTICES.md` for the full security notes used during development.
