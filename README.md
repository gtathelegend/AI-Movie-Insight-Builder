# AI Movie Insight Builder

AI Movie Insight Builder is a Next.js App Router application that takes an IMDb ID, fetches movie metadata, gathers audience reviews, runs AI sentiment analysis through OpenRouter, and presents a premium animated dashboard UI.

## Features (Current Working)

- IMDb ID search with client-side validation (`tt` + digits).
- Movie metadata from OMDb:
  - title
  - poster
  - year
  - IMDb rating
  - plot
  - cast list
- Review pipeline:
  - TMDb reviews as primary source (up to 20)
  - IMDb review scraping fallback via `axios` + `cheerio` (up to 15)
- AI sentiment analysis via OpenRouter (`openai/gpt-4o-mini`) using up to 10 reviews.
- Strict Zod validation for AI response.
- Local sentiment classification logic:
  - `score > 0.3` => `positive`
  - `score < -0.3` => `negative`
  - otherwise => `mixed`
- In-memory Map cache (TTL 1 hour) for analyze responses.
- Cinematic animated UI with Framer Motion:
  - hero/search animations
  - movie + AI insight layout transitions
  - staggered insight section reveals
  - skeleton loading state
- Reviews list shown after AI insight render.
- Graceful no-review info state without hiding movie metadata.

## API Overview

### `GET /api/movie?imdbID={id}`

Returns:

```json
{
  "movie": {
    "title": "string",
    "poster": "string",
    "year": "string",
    "rating": "string",
    "plot": "string",
    "cast": ["string"]
  },
  "reviews": ["string"],
  "hasReviews": true
}
```

### `POST /api/analyze`

Input:

```json
{
  "imdbID": "tt0133093",
  "reviews": ["..."]
}
```

Output:

```json
{
  "summary": "string",
  "keyThemes": ["string"],
  "pros": ["string"],
  "cons": ["string"],
  "sentimentScore": 0.42,
  "classification": "positive"
}
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- Zod
- OpenRouter API
- Jest
- Playwright
- Cheerio

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` (or copy from `.env.example`) and add:

```bash
OMDB_API_KEY=your_omdb_key
TMDB_API_KEY=your_tmdb_key
OPENROUTER_API_KEY=your_openrouter_key
APP_URL=http://localhost:3000
```

3. Run locally:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — lint project
- `npm run test` — run unit tests
- `npm run test:e2e` — run Playwright E2E test

## Project Structure

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
  ReviewsList.tsx
  Loader.tsx
lib/
  omdb.ts
  reviews.ts
  imdbScraper.ts
  openrouter.ts
  schema.ts
  cache.ts
  utils.ts
types/
  movie.ts
  ai.ts
tests/
  sentiment.test.ts
  movie.e2e.spec.ts
```

## Deployment (Vercel)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Configure environment variables:
   - `OMDB_API_KEY`
   - `TMDB_API_KEY`
   - `OPENROUTER_API_KEY`
   - `APP_URL` (set to deployed URL)
4. Deploy.

## Notes

- If no reviews are found from both TMDb and IMDb, metadata still renders and the app shows a clean informational message.
- AI insight panel is rendered only when analysis data is available.
- Do not commit real API keys to version control.
