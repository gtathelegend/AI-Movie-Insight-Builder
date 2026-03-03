# AI Movie Insight Builder

A production-ready Next.js internship assignment that accepts an IMDb ID, fetches movie metadata and audience reviews, runs AI analysis through OpenRouter, validates output with Zod, and displays structured sentiment insights in a responsive UI.

## 1) Project Overview

The app flow is:

1. User enters IMDb ID (example: `tt0133093`)
2. `GET /api/movie` fetches movie metadata from OMDb and reviews via TMDb (primary) + IMDb scraping (fallback)
3. `POST /api/analyze` sends reviews to OpenRouter for structured JSON insights
4. Response is validated with Zod
5. Sentiment classification is computed locally (`positive | mixed | negative`)
6. Results render in premium, mobile-friendly cards

## 2) Tech Stack Rationale

- **Next.js (App Router)**: Full-stack in one codebase with API routes and great Vercel deployment fit.
- **OpenRouter**: Flexible AI gateway and model routing (using `openai/gpt-4o-mini`) without direct OpenAI dependency.
- **Zod**: Runtime validation of AI output to enforce strict, predictable API contracts.
- **Map-based in-memory cache**: Fast, simple, interview-friendly TTL caching for repeated analyses.
- **TailwindCSS + Framer Motion**: Clean responsive styling and subtle loading animation.
- **Jest + Playwright**: Unit confidence for logic and one E2E path for user flow.

## 3) Setup Instructions

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Environment Variables

Create `.env.local` in project root:

```bash
OMDB_API_KEY=your_omdb_key
TMDB_API_KEY=your_tmdb_key
OPENROUTER_API_KEY=your_openrouter_key
APP_URL=http://localhost:3000
```

## 5) Assumptions

- TMDb reviews are used as audience review source and limited to max 20 entries.
- Some movies may have no reviews; UI handles this gracefully.
- Sentiment class is **not** AI-provided; it is derived in code from score thresholds.
- In-memory cache is process-local (acceptable for assignment scope).

## 6) Deployment Steps (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set environment variables in Vercel Project Settings:
   - `OMDB_API_KEY`
   - `TMDB_API_KEY`
   - `OPENROUTER_API_KEY`
   - `APP_URL` (set to deployed URL)
4. Deploy.

## Scripts

- `npm run dev` – start local dev server
- `npm run build` – production build
- `npm run start` – serve production build
- `npm run lint` – ESLint check
- `npm run test` – Jest unit tests
- `npm run test:e2e` – Playwright E2E tests

## Key Project Structure

```text
app/
  page.tsx
  api/
    movie/route.ts
    analyze/route.ts
components/
  SearchBar.tsx
  MovieCard.tsx
  SentimentCard.tsx
  Loader.tsx
lib/
  omdb.ts
  reviews.ts
  openrouter.ts
  cache.ts
  schema.ts
  utils.ts
types/
  movie.ts
  ai.ts
tests/
  sentiment.test.ts
  movie.e2e.spec.ts
```
