# AI Movie Insight Builder

A Next.js application that turns a movie title (or IMDb ID) into a complete audience intelligence report — pulling cinematic metadata, mining real reviews, and streaming AI-powered sentiment analysis across eight live sections of a POP-themed cinema dashboard.

---

## How It Works

```text
Movie title OR IMDb ID
     │
     ├── Title path: GET /api/search?q=...   (TMDb live search)
     │                       │
     │                       ▼
     │             GET /api/resolve?tmdbId=… → IMDb ID
     │
     ▼
GET /api/movie?imdbID=…
     ├── OMDb API → title, poster, year, rating, plot, cast, RT score
     └── Review pipeline
           ├── TMDb API (up to 20 reviews)
           └── IMDb HTML scraping fallback (up to 15 reviews)
     │
     ▼
POST /api/analyze   (Server-Sent Events stream)
     ├── L1 in-memory cache (SHA-256 keyed, 1h TTL)
     ├── L2 Prisma/Postgres cache (24h TTL)
     ├── OpenRouter LLM → AI insights (summary, themes, pros/cons,
     │                                  emotions, clusters, characters,
     │                                  audience-vs-critics, sentiment)
     ├── Zod schema validation
     └── Streams progress to client via SSE
     │
     ▼
POP cinema dashboard
     ├── Hero — autocomplete search (3-char trigger)
     ├── Trending — live TMDb top 8 (clickable → full analysis)
     ├── Spotlight — poster, metadata, cast, sentiment bucket
     ├── Score Breakdown — sentiment, highlights, pain points, themes
     ├── Emotion Intelligence — 7-dimension emotional fingerprint
     ├── Audience vs Critics — score comparison + verdict
     ├── Review Clusters — opinion clusters with representative quotes
     ├── Character Intelligence — characters mentioned + sentiment
     ├── Now Showing Filmstrip — live TMDb now-playing (clickable)
     └── Reviews — real audience quotes
```

---

## Features

### Search

- **Type-ahead autocomplete** — start typing a movie title; results appear after 3 characters with poster thumbnails, year, and TMDb score
- **Dual input** — search bar accepts either a movie title *or* a raw IMDb ID (`tt0133093`)
- **Keyboard nav** — `↑` / `↓` / `Enter` / `Esc` through autocomplete results
- **Clickable suggestions** — picking a result immediately resolves to IMDb and triggers full analysis
- **Debounced** — 280 ms debounce + 5-minute in-memory cache on the search endpoint

### Live Data Everywhere

- **Trending grid** — TMDb weekly top 8, hover for 3D tilt, click to analyze
- **Now-Showing filmstrip** — TMDb now-playing horizontal pinned-scroll reel, clickable frames
- **No section uses static placeholder data once a movie is selected** — every panel is wired to real OMDb / TMDb / LLM output

### AI Sentiment Analysis (Streaming)

- LLM via OpenRouter analyzes up to 10 reviews per film
- **Eight live insight surfaces** extracted from a single AI call:
  - Summary + key themes + pros + cons
  - Sentiment score (−1 to +1) with classification (Positive / Mixed / Negative)
  - Emotion profile (excitement, satisfaction, inspiration, nostalgia, sadness, fear, confusion)
  - Audience-vs-critics comparison + verdict
  - Review clusters with representative quotes and weight percentages
  - Character intelligence (mentions + sentiment per character)
- **Server-Sent Events stream** progress steps to the client (`checking_cache → analyzing → processing → saving → complete`)
- Strict Zod schema validation on every AI response

### Performance & Reliability

- **Two-tier cache** — SHA-256 keyed in-memory (1 h) + Prisma/Postgres (24 h); both warmed transparently
- **Graceful degradation** — DB cache is optional (no `DATABASE_URL` → in-memory only); IMDb scraping fallback when TMDb has no reviews
- **Per-endpoint caching** — search (5 min), trending (1 h), now-playing (1 h), resolve (memoized)
- **Input validation and typed errors** at every API boundary

### UX / Theming

- POP cinema visual language — Bagel Fat One display font, hand-drawn SVG props, GSAP curtain reveal
- Popcorn-rain ambient effect, animated score "bucket" SVG, marquee strip
- GSAP scroll-triggered reveal for every section, pinned horizontal filmstrip
- Fully responsive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Plain CSS (custom POP theme) + Tailwind 4 utilities |
| Animations | GSAP 3 (ScrollTrigger), Framer Motion |
| Validation | Zod 4 |
| HTTP Client | Axios |
| HTML Parsing | Cheerio |
| AI Provider | OpenRouter |
| Movie Metadata | OMDb API |
| Movie Search / Trending / Now-Playing | TMDb API |
| Reviews | TMDb API + IMDb scraping fallback |
| DB Cache | Prisma + Postgres (optional) |
| Unit Testing | Jest 30 |
| E2E Testing | Playwright |

---

## Project Structure

```text
app/
├── page.tsx                       # Main client page — state, search, analyze orchestration
├── layout.tsx                     # Root layout (Bagel Fat One, JetBrains Mono, Nunito)
├── globals.css                    # POP theme + autocomplete dropdown styles
└── api/
    ├── search/route.ts            # GET /api/search?q=… — TMDb live title search
    ├── resolve/route.ts           # GET /api/resolve?tmdbId=… — TMDb id → IMDb id
    ├── trending/route.ts          # GET /api/trending — TMDb weekly top 8
    ├── nowplaying/route.ts        # GET /api/nowplaying — TMDb now-playing (filmstrip)
    ├── movie/route.ts             # GET /api/movie?imdbID=… — metadata + reviews
    └── analyze/route.ts           # POST /api/analyze — SSE stream of AI analysis

components/pop/
├── NavBar.tsx                     # Sticky nav, hide-on-scroll
├── HeroSection.tsx                # Search input + autocomplete dropdown
├── MarqueeStrip.tsx               # Marquee with movie title + score
├── TrendingGrid.tsx               # Live TMDb top 8 (clickable)
├── DetailSection.tsx              # Spotlight: poster, cast, sentiment bucket
├── ScoreBucket.tsx                # Animated popcorn-bucket SVG score viz
├── BreakdownSection.tsx           # 4 AI cards: sentiment, highlights, pain points, themes
├── EmotionSection.tsx             # 7-dimension emotional fingerprint bars
├── AudienceVsCriticsSection.tsx   # Side-by-side audience vs critic scores
├── ClusterSection.tsx             # Opinion clusters + representative quotes
├── CharacterSection.tsx           # Characters mentioned + sentiment chips
├── FilmstripSection.tsx           # Pinned horizontal scroll of TMDb now-playing
├── CommentsSection.tsx            # Real audience reviews as tilted cards
├── FooterSection.tsx              # Snack-bar + sitemap footer
├── PopcornRain.tsx                # Ambient popcorn particle effect
└── data.ts                        # Decorative constants (chips, gradients, fallbacks)

lib/
├── omdb.ts                        # OMDb API client (metadata + RT score)
├── reviews.ts                     # Review pipeline: TMDb → IMDb scrape fallback
├── imdbScraper.ts                 # IMDb HTML scraping with Cheerio
├── openrouter.ts                  # OpenRouter AI client
├── cache.ts                       # In-memory L1 cache (Map + TTL)
├── db.ts                          # Prisma client loader (graceful when absent)
├── schema.ts                      # Zod validation schemas
└── utils.ts                       # Sentiment classifier, SHA-256 hashing, ApiError

types/
├── movie.ts                       # Movie, MovieResponse
└── ai.ts                          # AIInsights, EmotionProfile, ReviewCluster,
                                   #   CharacterInsight, AudienceVsCritics,
                                   #   AnalyzeResponse, SSEEvent
```

---

## API Reference

### `GET /api/search?q={title}`

Live TMDb movie search. Returns up to 8 results with poster thumbnails. Cached in-memory for 5 minutes per query.

```text
GET /api/search?q=interstellar
```

```json
[
  { "tmdbId": 157336, "title": "Interstellar", "year": "2014",
    "poster": "https://image.tmdb.org/t/p/w154/…jpg", "score": 0.85 }
]
```

Queries shorter than 3 characters return `[]`.

---

### `GET /api/resolve?tmdbId={id}`

Resolves a TMDb movie id to its IMDb id via TMDb `/external_ids`. Used after the user picks a search/trending/filmstrip result.

```json
{ "imdbID": "tt0816692" }
```

---

### `GET /api/trending`

TMDb weekly trending top 8 with posters and genre tags. 1-hour cache.

---

### `GET /api/nowplaying`

TMDb now-playing top 10 with posters, used to populate the horizontal filmstrip. 1-hour cache.

---

### `GET /api/movie?imdbID={id}`

Validates the IMDb ID, fetches OMDb metadata, and aggregates reviews from TMDb (with IMDb scraping fallback).

```json
{
  "movie": {
    "title": "The Matrix",
    "poster": "https://...",
    "year": "1999",
    "rating": "8.7",
    "plot": "A computer hacker learns from mysterious rebels...",
    "cast": ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    "genre": "Action, Sci-Fi",
    "director": "Lana Wachowski, Lilly Wachowski",
    "runtime": "136 min",
    "metascore": "73",
    "rottenTomatoes": "83%"
  },
  "reviews": ["A genre-defining masterpiece...", "Changed sci-fi forever..."],
  "hasReviews": true
}
```

| Status | Reason |
|---|---|
| `400` | IMDb ID format invalid (`tt` + 7–8 digits) |
| `404` | Movie not found |
| `500` | Upstream API failure |

---

### `POST /api/analyze`

Streams AI sentiment analysis over Server-Sent Events. Reads from L1 in-memory cache, then L2 Prisma cache, then calls the LLM.

**Request**

```json
{
  "imdbID": "tt0133093",
  "reviews": ["Review text...", "Another review..."],
  "movieTitle": "The Matrix",
  "movieYear": "1999",
  "rottenTomatoes": "83%"
}
```

**Response stream** — `text/event-stream` with `data:` events:

```text
data: {"step":"checking_cache","message":"Checking cache..."}
data: {"step":"analyzing","message":"AI is analyzing audience reviews..."}
data: {"step":"processing","message":"Processing intelligence insights..."}
data: {"step":"saving","message":"Saving to database..."}
data: {"step":"complete","data":{ /* full AnalyzeResponse */ }}
```

The terminal `complete` event payload:

```json
{
  "summary": "Audiences praised the groundbreaking visuals...",
  "keyThemes": ["identity", "technology", "free will"],
  "pros": ["Groundbreaking visual effects", "Compelling narrative"],
  "cons": ["Dense exposition in early acts"],
  "sentimentScore": 0.76,
  "classification": "positive",
  "emotions": { "excitement": 78, "satisfaction": 71, "inspiration": 65,
                 "nostalgia": 52, "sadness": 35, "fear": 24, "confusion": 18 },
  "audienceVsCritics": { "audienceScore": 87, "criticScore": 79,
                          "verdict": "Audiences connect more deeply..." },
  "clusters": [
    { "label": "Phenomenal acting", "percentage": 42,
      "representative": "Once-in-a-generation performance..." }
  ],
  "characters": [
    { "name": "Neo", "sentiment": "positive", "mentions": 12 }
  ],
  "fromCache": false
}
```

| Status | Reason |
|---|---|
| `400` | No reviews provided |
| `500` (via SSE `error` event) | AI response failed validation or upstream error |

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

Create `.env.local`:

```env
OMDB_API_KEY=your_omdb_key        # https://www.omdbapi.com/apikey.aspx
TMDB_API_KEY=your_tmdb_key        # https://www.themoviedb.org/settings/api
OPENROUTER_API_KEY=your_key       # https://openrouter.ai/keys
APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...     # optional — Prisma L2 cache, skip for in-memory only
```

### 3. (Optional) Prisma DB cache

If using the L2 cache, generate the client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

Without `DATABASE_URL`, the app silently falls back to in-memory cache only.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Type **"matrix"** to see autocomplete in action, or click any trending poster / filmstrip frame to analyze.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## Deployment (Vercel)

1. Push repository to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables: `OMDB_API_KEY`, `TMDB_API_KEY`, `OPENROUTER_API_KEY`, `APP_URL` (set to deployed URL), and `DATABASE_URL` if using Prisma cache
4. Deploy — Vercel auto-detects Next.js and deploys API routes as serverless functions

---

## Notes

- Movie metadata renders even when no reviews are found; AI analysis is skipped with a clean info message
- L1 in-memory cache resets on server restart; L2 Prisma cache survives restarts (24 h TTL)
- The autocomplete dropdown is suppressed when the input already looks like an IMDb ID (`tt` + 7–8 digits)
- Trending and filmstrip cards trigger the full pipeline on click — TMDb id → resolve to IMDb → fetch → analyze
- Never commit `.env.local` to version control
