# AI Movie Insight Builder

A Next.js application that turns an IMDb ID into a complete audience intelligence report — pulling cinematic metadata, mining real reviews, and running AI-powered sentiment analysis in a single flow.

---

## How It Works

```text
IMDb ID input
     │
     ▼
GET /api/movie
     ├── OMDb API → title, poster, year, rating, plot, cast
     └── Review pipeline
           ├── TMDb API (up to 20 reviews)
           └── IMDb HTML scraping fallback (up to 15 reviews)
     │
     ▼
POST /api/analyze
     ├── OpenRouter → GPT-4o-mini (up to 10 reviews)
     ├── Zod schema validation
     └── In-memory cache (1-hour TTL, SHA-256 key)
     │
     ▼
Animated dashboard
     ├── MovieCard — poster, metadata, cast
     ├── SentimentCard — summary, themes, pros/cons, score
     └── ReviewsList — extracted audience reviews
```

---

## Features

### Movie Intelligence

- Full metadata via OMDb: title, poster, year, IMDb rating, plot, cast
- Audience reviews aggregated from TMDb with IMDb scraping as fallback
- Graceful handling when no reviews are available

### AI Sentiment Analysis

- GPT-4o-mini via OpenRouter analyzes up to 10 reviews per film
- Extracts: summary, key themes, pros, cons, sentiment score (−1 to +1)
- Classification: **Positive** (> 0.3) · **Mixed** (−0.3 to 0.3) · **Negative** (< −0.3)
- Strict Zod schema validation on every AI response

### Performance & Reliability

- SHA-256 keyed in-memory cache with 1-hour TTL prevents duplicate AI calls
- Multi-stage fallback: TMDb reviews → IMDb scraping → graceful no-review state
- Input validation and typed errors at every API boundary

### Developer Experience

- Full TypeScript with Zod runtime validation
- Unit tests with Jest, E2E tests with Playwright
- Responsive animated UI with Framer Motion

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Validation | Zod 4 |
| HTTP Client | Axios |
| HTML Parsing | Cheerio |
| AI Provider | OpenRouter (GPT-4o-mini) |
| Movie Metadata | OMDb API |
| Reviews | TMDb API + IMDb scraping |
| Unit Testing | Jest 30 |
| E2E Testing | Playwright |

---

## Project Structure

```text
app/
├── page.tsx                 # Main client page — state, data fetching, layout
├── layout.tsx               # Root layout (Inter font, metadata)
├── globals.css              # Global Tailwind styles
└── api/
    ├── movie/route.ts       # GET /api/movie — metadata + review pipeline
    └── analyze/route.ts     # POST /api/analyze — AI sentiment analysis

components/
├── SearchBar.tsx            # IMDb ID input with validation and Enter-key support
├── MovieCard.tsx            # Poster, metadata, cast chips
├── SentimentCard.tsx        # AI insights with animated sentiment progress bar
├── ReviewsList.tsx          # Scrollable list of extracted audience reviews
└── Loader.tsx               # Skeleton loading state

lib/
├── omdb.ts                  # OMDb API client
├── reviews.ts               # Review aggregation pipeline (TMDb → IMDb fallback)
├── imdbScraper.ts           # IMDb HTML scraping with Cheerio
├── openrouter.ts            # OpenRouter AI client
├── cache.ts                 # In-memory Map cache with TTL
├── schema.ts                # Zod validation schemas
└── utils.ts                 # Sentiment classifier, SHA-256 hashing

types/
├── movie.ts                 # Movie, MovieResponse
└── ai.ts                    # AIInsights, AnalyzeResponse, SentimentClassification

tests/
├── sentiment.test.ts        # Jest unit tests
└── movie.e2e.spec.ts        # Playwright E2E tests
```

---

## API Reference

### `GET /api/movie?imdbID={id}`

Validates the IMDb ID, fetches metadata from OMDb, and aggregates reviews from TMDb (with IMDb fallback).

**Request**

```text
GET /api/movie?imdbID=tt0133093
```

**Response**

```json
{
  "movie": {
    "title": "The Matrix",
    "poster": "https://...",
    "year": "1999",
    "rating": "8.7",
    "plot": "A computer hacker learns from mysterious rebels...",
    "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
  },
  "reviews": ["A genre-defining masterpiece...", "Changed sci-fi forever..."],
  "hasReviews": true
}
```

**Errors**

| Status | Reason |
|---|---|
| `400` | IMDb ID format invalid (`tt` + 7–8 digits required) |
| `404` | Movie not found |
| `500` | Upstream API failure |

---

### `POST /api/analyze`

Runs AI sentiment analysis on up to 10 reviews. Responses are cached for 1 hour per IMDb ID.

**Request**

```json
{
  "imdbID": "tt0133093",
  "reviews": ["Review text...", "Another review..."]
}
```

**Response**

```json
{
  "summary": "Audiences praised the groundbreaking visuals and philosophical depth...",
  "keyThemes": ["identity", "technology", "free will"],
  "pros": ["Groundbreaking visual effects", "Compelling philosophical narrative"],
  "cons": ["Dense exposition in early acts", "Supporting characters underdeveloped"],
  "sentimentScore": 0.76,
  "classification": "positive"
}
```

**Errors**

| Status | Reason |
|---|---|
| `400` | No reviews provided |
| `500` | AI response failed validation or upstream error |

---

## Setup

**Requirements:** Node.js 20+

### 1. Clone and install

```bash
git clone https://github.com/your-username/AI-Movie-Insight-Builder.git
cd AI-Movie-Insight-Builder
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
OMDB_API_KEY=your_omdb_key        # https://www.omdbapi.com/apikey.aspx (free tier available)
TMDB_API_KEY=your_tmdb_key        # https://www.themoviedb.org/settings/api (free)
OPENROUTER_API_KEY=your_key       # https://openrouter.ai/keys
APP_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try `tt0133093` (The Matrix) to test the full flow.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## Deployment (Vercel)

1. Push repository to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables: `OMDB_API_KEY`, `TMDB_API_KEY`, `OPENROUTER_API_KEY`, `APP_URL` (set to deployed URL)
4. Deploy — Vercel auto-detects Next.js and deploys API routes as serverless functions

---

## Notes

- Movie metadata renders even when no reviews are found; AI analysis is skipped with a clean info message
- Cache is in-memory and resets on server restart — suitable for development and single-instance deployments
- Never commit `.env.local` to version control
