# Personal-Movie-Journal

## Description
Personal Movie Journal is a full‑stack web app that lets users search movies via TMDB,
save them to a personal watch space, add ratings/comments, and mark favorites.
It also includes AI movie recommendations using Gemini.

## Tech Stack
- Frontend: React, Vite, Axios
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
- `VITE_TMDB_TOKEN` (optional; only used if the Home page calls TMDB directly)

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
- `VITE_TMDB_TOKEN` (optional; only needed if Home calls TMDB directly)
