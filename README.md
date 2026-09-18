# AI Movie Insight Builder 🎬🍿

A production-ready Next.js application that transforms a movie title or IMDb ID into a comprehensive audience intelligence report — pulling verified cinematic metadata, aggregating multi-source audience reviews, and streaming evidence-grounded AI sentiment analysis across a dynamic POP-themed cinema dashboard.

---

## Architecture & Data Flow

```text
User Search (Title or IMDb ID) / Trending Card / Filmstrip Pick
      │
      ├── Title search ────────► GET /api/search?q=... (TMDb live autocomplete)
      │                                   │
      │                                   ▼
      │                          GET /api/resolve?tmdbId=... ──► IMDb ID
      │
      ▼
GET /api/movie?imdbID=...
      ├── OMDb API ────────────► Canonical metadata (Title, Year, Poster, Plot, Cast, Director, Ratings)
      └── Review Pipeline ─────► TMDb Reviews API (Primary source)
                                          │ (if empty / insufficient)
                                          ▼
                                 IMDb Scraping Fallback (Cheerio HTML parser)
                                          │
                                          ▼
                                 Review Sanitization (Deduplication, HTML stripping, length filter)
      │
      ▼
POST /api/analyze (Server-Sent Events Stream)
      ├── L1 In-Memory Cache (SHA-256 keyed, 1-hour TTL)
      ├── L2 Prisma / PostgreSQL Cache (Optional, 24-hour TTL)
      ├── OpenRouter AI (Evidence-grounded synthesis with structured JSON prompt)
      ├── Zod Schema Validation & Deterministic Sentiment Classification
      └── Real-time SSE Stage Progress ──► Client Stepper
      │
      ▼
Cinematic POP Cinema Dashboard
      ├── Hero Section ──────────► Accessible Autocomplete Search (ARIA combobox)
      ├── Marquee & Progress ────► Live animated ribbon & SSE Status Stepper
      ├── Movie Spotlight ───────► Fluid transition from full-width to dual-column split
      ├── Intelligence Breakdown ─► AI summary, consensus badges, pros & cons, theme tags
      ├── Emotional Fingerprint ─► 7-dimension SVG emotion metrics & intensity badges
      ├── Audience vs. Critics ──► Visual score comparison & discrepancy verdict
      ├── Opinion Clusters ──────► Cluster weight bars with representative review quotes
      ├── Character Intelligence ─► Cast mention counts & sentiment polarity chips
      ├── Snack Correlation ─────► Thematic concession pairings derived from sentiment
      ├── Audience Reviews ──────► Multi-source review cards with verified source attribution
      └── Source Transparency ───► Full disclosure of data providers, sample sizes, and LLM roles
```

---

## Data Source Separation

| Provider | Role in Pipeline | Fallback / Safeguard |
|---|---|---|
| **OMDb API** | Canonical movie metadata (Title, Year, Rated, Runtime, Genre, Director, Cast, Plot, Poster, Metascore, Rotten Tomatoes) | Validated via Zod schemas with fallback poster placeholders |
| **TMDb API** | Live search autocomplete, Weekly Trending, Now-Playing Filmstrip, Primary audience reviews, TMDb → IMDb ID resolution | 280ms debounced type-ahead + 5-minute memory cache |
| **IMDb Scraper** | Secondary audience review fallback when TMDb provides 0 reviews | Resilient Cheerio HTML parser with sanitization |
| **OpenRouter AI** | Multi-dimensional audience sentiment synthesis, thematic clustering, character sentiment, and emotional fingerprinting | Grounded strictly in review text; fallback graceful notice if unavailable |
| **Prisma / PostgreSQL** | Optional L2 persistent cache for analyzed insights (24h TTL) | Transparent fallback to L1 in-memory caching if `DATABASE_URL` is omitted |

---

## Core Capabilities & Features

### 1. Unified Search & Resolution
- **Type-Ahead Autocomplete**: Instant search results with poster thumbnails, release years, and TMDb vote averages.
- **IMDb ID Direct Analysis**: Directly accepts IMDb IDs (e.g., `tt0133093`) or movie titles.
- **Full Keyboard Navigation**: Accessible arrow keys, `Enter`, `Escape`, and screen-reader ARIA combobox attributes.

### 2. Multi-Source Review Aggregation & Grounding
- **TMDb Primary + IMDb Fallback**: Pulls public audience reviews from TMDb, falling back to IMDb when necessary.
- **Sanitization & Deduplication**: Cleans raw review text, strips HTML tags, removes boilerplate, and filters out noise.
- **Evidence Grounding**: AI insights are strictly constrained to collected audience feedback to eliminate hallucinations.
- **Source Attribution**: Transparently labels review origins (`TMDb`, `IMDb`) and reports collected vs. analyzed sample counts.

### 3. Real-Time Streaming AI Analysis
- **Server-Sent Events (SSE)**: Streams step-by-step progress (`checking_cache` → `analyzing` → `processing` → `saving` → `complete`).
- **Deterministic Sentiment Classification**: Sentiment score mapped reliably to Positive, Mixed, or Negative classifications.
- **Strict Zod Validation**: AI JSON responses are strictly validated before returning to the client.
- **Zero-Review Graceful Guard**: If no reviews are available, the movie metadata remains fully visible while providing a clean informational notice without making wasteful AI calls.

### 4. Cinematic Layout & Information Hierarchy
- **State A → State B Split Layout**: Seamless transition from a centered hero movie card into a dual-column split featuring the movie spotlight beside the AI intelligence matrix.
- **Pure SVG & CSS Visualizations**: Custom zero-dependency data visualizations including emotional spectrum gauges, cluster distribution bars, and audience-vs-critic comparison meters.
- **Accessible & Responsive**: Fully responsive from 320px mobile viewports to ultra-wide displays with `prefers-reduced-motion` compliance.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Vanilla CSS Design System + Modern CSS Variables |
| **Motion** | GSAP 3 (ScrollTrigger), Framer Motion |
| **Validation** | Zod 4 |
| **HTML Parsing** | Cheerio |
| **AI Synthesis** | OpenRouter (`openai/gpt-4o-mini` or configured model) |
| **External APIs** | OMDb API, TMDb API |
| **Database Cache** | Prisma ORM + PostgreSQL (Optional L2) |
| **Testing** | Jest (Unit) + Playwright (End-to-End) |

---

## Environment Variables & Security

Create a `.env.local` file in the project root:

```env
# Required for movie metadata
OMDB_API_KEY=your_omdb_api_key

# Required for search, trending, now-playing, and primary reviews
TMDB_API_KEY=your_tmdb_api_key

# Required for AI audience synthesis
OPENROUTER_API_KEY=your_openrouter_api_key

# Application Base URL
APP_URL=http://localhost:3000

# Optional: PostgreSQL Database URL for L2 caching (omit for in-memory only)
DATABASE_URL=postgresql://postgres:password@localhost:5432/movielens?schema=public
```

> [!IMPORTANT]
> **Security Safeguards**:
> - All API keys and scraping credentials are kept strictly server-side in API routes and `lib/` modules.
> - Zero `NEXT_PUBLIC_` sensitive secrets are exposed to client bundles.
> - Input validation and sanitation are applied to all user queries and external payloads.

---

## Local Development & Setup

### 1. Installation
```bash
git clone https://github.com/your-username/AI-Movie-Insight-Builder.git
cd AI-Movie-Insight-Builder
npm install
```

### 2. (Optional) Database Setup
If using PostgreSQL for persistent L2 caching:
```bash
npx prisma generate
npx prisma db push
```
*Note: If `DATABASE_URL` is not configured, the application automatically runs in high-performance L1 in-memory cache mode.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification & Testing

### Unit Tests
Runs 20 comprehensive unit tests covering sentiment mapping, review cleaning, cache hashing, and schema validation:
```bash
npm test
```

### End-to-End Tests
Runs Playwright E2E suites verifying search, autocomplete, IMDb resolution, streaming SSE analysis, zero-review handling, and mobile responsiveness:
```bash
npm run test:e2e
```

### Lint & Build
```bash
npm run lint
npm run build
```

---

## Deployment (Vercel)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Add the required environment variables (`OMDB_API_KEY`, `TMDB_API_KEY`, `OPENROUTER_API_KEY`, `APP_URL`, and optionally `DATABASE_URL`).
4. Click **Deploy**. Vercel will automatically build the Next.js application and deploy the API routes as edge/serverless functions.

---

## License
MIT License. Built for modern cinematic audience intelligence.
