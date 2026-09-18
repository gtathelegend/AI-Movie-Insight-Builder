# POP — AI Movie Insights

> Discover movies through real audience voices, movie metadata, and evidence-grounded AI insights.

**Live Demo:** [https://pop.vedaangsharma.in/](https://pop.vedaangsharma.in/)

---

## What is POP?

**POP** is a cinematic movie insight experience that combines verified movie metadata, publicly available audience reviews, and AI-generated analysis in a single interactive dashboard.

Users can search for any movie by title or IMDb ID, explore its cast and details, read real audience reviews, and generate an AI-powered audience perspective when review evidence is available.

---

## What You Can Do

- **Search Movies**: Type-ahead autocomplete search by movie title or direct IMDb ID (e.g. `tt0133093`).
- **Browse Discovery Reels**: Explore weekly trending films and now-playing cinema releases from TMDb.
- **View Movie Metadata**: High-resolution poster, release year, runtime, genre, director, cast list, plot summary, and official ratings.
- **Retrieve Audience Reviews**: Automated collection of public viewer reviews from TMDb, with IMDb scraping as a fallback.
- **Analyze Sentiment with AI**: Server-authoritative sentiment scoring (−1.0 to +1.0) and classification (Positive, Mixed, or Negative).
- **Explore Thematic Breakdown**: AI-synthesized executive summary, key themes, audience likes, and audience dislikes.
- **View Emotional Fingerprint**: 7-dimension emotional intensity breakdown (Excitement, Satisfaction, Inspiration, Nostalgia, Sadness, Fear, Confusion).
- **Audience vs. Critics Comparison**: Side-by-side comparison of audience consensus with Rotten Tomatoes data where available.
- **Opinion Clusters**: Grouped audience perspectives with representative quotes and community weight percentages.
- **Character Discussion**: Mentions and sentiment breakdown for key characters discussed by viewers.
- **Inspect Original Review Evidence**: Browse real audience review excerpts with transparent source attribution (`TMDb` or `IMDb`).
- **Accessible & Responsive**: Fully responsive layout from mobile (375px) to desktop, with ARIA combobox keyboard navigation and reduced-motion support.

---

## How It Works

```text
1. Search       ──► Enter a movie title or IMDb ID (e.g., tt0133093)
                       │
2. Identify     ──► Retrieve canonical movie metadata via OMDb & TMDb
                       │
3. Gather       ──► Fetch audience reviews from TMDb (with IMDb scraping fallback)
                       │
4. Analyze      ──► Stream review evidence to OpenRouter AI via Server-Sent Events (SSE)
                       │
5. Explore      ──► Interactive POP dashboard with sentiment, themes, emotions & real reviews
```

> **Note on Evidence Grounding:** AI insights are generated directly from retrieved audience reviews. The application does not fabricate reviews or synthesize insights without underlying review evidence.

---

## Data Sources

| Source | Role in Application |
|---|---|
| **[OMDb API](https://www.omdbapi.com/)** | Canonical movie metadata, plot summaries, cast lists, and official rating scores |
| **[TMDb API](https://www.themoviedb.org/)** | Search autocomplete, weekly trending titles, now-playing filmstrip, primary audience reviews, and TMDb-to-IMDb ID resolution |
| **[IMDb](https://www.imdb.com/)** | Secondary fallback for audience review retrieval when TMDb reviews are insufficient |
| **[OpenRouter](https://openrouter.ai/)** | Multi-dimensional AI synthesis strictly constrained to collected review evidence |

---

## AI Insights & Evidence Grounding

The AI analysis pipeline synthesizes structured insights from retrieved audience feedback:

- **Overall Sentiment & Score**: Deterministic classification (Positive, Mixed, Negative) derived from audience feedback.
- **Summary & Consensus**: A concise breakdown of how audiences responded to the film.
- **Key Themes**: Prominent storytelling, visual, and thematic elements highlighted by viewers.
- **Audience Likes & Dislikes**: Key highlights and pain points extracted from reviews.
- **Emotional Fingerprint**: 7-axis emotional spectrum modeled from audience sentiment.
- **Opinion Clusters**: Categorized viewpoints with representative quotes and share percentages.
- **Character Discussion**: Viewer sentiment and mention volume for core characters.

### Understanding the Distinction

- **Audience Evidence**: Original, sanitized public review quotes retrieved from external providers (TMDb / IMDb).
- **AI Synthesis**: Thematic extraction, emotional modeling, and summaries produced by the language model based on the retrieved evidence.

---

## Review Pipeline

```text
TMDb Audience Reviews
        │
        ├── (if reviews found) ──────────► Clean & Deduplicate ──► AI Analysis
        │
        └── (if 0 reviews from TMDb)
                │
                ▼
        IMDb Scraping Fallback
                │
                ├── (if reviews found) ──► Clean & Deduplicate ──► AI Analysis
                │
                └── (if 0 reviews) ──────► Keep Movie Metadata Visible
                                           Display Friendly Notice (Skip AI Call)
```

- Raw review text is cleaned, deduplicated, and stripped of HTML tags and boilerplate before analysis.
- Source attribution (`TMDb` / `IMDb`) is preserved for every review quote.
- If no public audience reviews are available, movie metadata remains fully visible and AI analysis is skipped gracefully.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router, Turbopack, and serverless API routes |
| **TypeScript 5** | End-to-end type safety across data pipelines and AI schemas |
| **React 19** | Modern component UI architecture |
| **Vanilla CSS & Tailwind CSS** | Custom POP cinema design system and responsive tokens |
| **Framer Motion 12** | Layout split animations and component transitions |
| **GSAP 3** | ScrollTrigger cinematic reveals and horizontal filmstrip pinned reel |
| **Zod 4** | Runtime schema validation for API inputs and AI responses |
| **Axios** | Robust HTTP client for external API requests |
| **Cheerio** | Resilient HTML parser for IMDb review scraping fallback |
| **OpenRouter** | LLM gateway for structured audience intelligence analysis |
| **Prisma ORM & PostgreSQL** | Optional persistent L2 caching for analyzed insights |
| **Jest & Playwright** | Unit and end-to-end testing suites |

---

## Architecture

```text
User Browser
    │
    ▼
Next.js App Router (Frontend)
    │
    ├── GET /api/search?q=...       ──► TMDb Autocomplete (In-memory cached)
    ├── GET /api/resolve?tmdbId=... ──► TMDb ID Resolution
    ├── GET /api/movie?imdbID=...   ──► OMDb Metadata + TMDb/IMDb Review Pipeline
    └── POST /api/analyze           ──► Server-Sent Events (SSE) Streaming Pipeline
                                            │
                                            ├── L1 In-Memory Cache (SHA-256 keyed)
                                            ├── L2 Prisma PostgreSQL Cache (Optional)
                                            ├── OpenRouter AI Analysis
                                            └── Zod Schema Validation
```

---

## Privacy & Data Handling

- **No User Accounts**: POP does not require user registration, passwords, or personal profiles.
- **Search Queries**: Movie titles and IMDb IDs entered by users are processed solely to retrieve relevant movie data.
- **Server-Side Credentials**: All third-party API keys (OMDb, TMDb, OpenRouter, database credentials) are strictly kept server-side and never exposed to client bundles.
- **Caching**: Movie details and analyzed insights may be cached in server memory (L1) or PostgreSQL (L2) to reduce redundant upstream requests.

Read the full [Privacy Policy](https://pop.vedaangsharma.in/privacy).

---

## Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### 1. Clone & Install

```bash
git clone https://github.com/vedaangsharma2006/AI-Movie-Insight-Builder.git
cd AI-Movie-Insight-Builder
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required for movie metadata
OMDB_API_KEY=your_omdb_api_key

# Required for movie search, trending, and primary reviews
TMDB_API_KEY=your_tmdb_api_key

# Required for AI sentiment synthesis
OPENROUTER_API_KEY=your_openrouter_api_key

# Application Base URL
APP_URL=http://localhost:3000

# Optional: PostgreSQL Connection String for L2 Persistent Cache
DATABASE_URL=postgresql://postgres:password@localhost:5432/pop?schema=public
```

*(Note: If `DATABASE_URL` is omitted, POP automatically falls back to fast L1 in-memory caching.)*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables Reference

| Variable | Required | Purpose |
|---|---|---|
| `OMDB_API_KEY` | **Yes** | Fetches canonical movie metadata, plot summaries, and official ratings from OMDb |
| `TMDB_API_KEY` | **Yes** | Powers live search autocomplete, trending lists, now-playing filmstrip, and primary reviews |
| `OPENROUTER_API_KEY` | **Yes** | Synthesizes audience review evidence into structured multi-dimensional insights |
| `APP_URL` | **Yes** | Base URL for internal API resolutions and metadata |
| `DATABASE_URL` | *Optional* | PostgreSQL connection string for 24-hour persistent L2 insight caching |

---

## Testing & Quality Assurance

The codebase includes automated unit and end-to-end test suites:

```bash
# Run ESLint code quality checks
npm run lint

# Run Jest unit test suite (20 tests covering sentiment mapping, review cleaning, and validation)
npm test

# Run Next.js production build check
npm run build

# Run Playwright E2E test suite (10 automated browser tests across all pages and flows)
npm run test:e2e
```

---

## Deployment (Vercel)

The application is deployed on [Vercel](https://vercel.com/):

1. Connect the GitHub repository to Vercel.
2. In the Vercel project settings, configure the environment variables:
   - `OMDB_API_KEY`
   - `TMDB_API_KEY`
   - `OPENROUTER_API_KEY`
   - `APP_URL` (set to `https://pop.vedaangsharma.in`)
   - `DATABASE_URL` (optional PostgreSQL database)
3. Deploy. Vercel automatically detects Next.js App Router and provisions edge/serverless routes.

**Live Production URL:** [https://pop.vedaangsharma.in/](https://pop.vedaangsharma.in/)

---

## Limitations

- **Review Availability**: Niche or newly released films may have limited public audience reviews on TMDb/IMDb.
- **IMDb Scraping Fallback**: As with all web-scraping fallbacks, IMDb HTML parsing may be affected by upstream DOM changes or rate limiting.
- **Evidence Dependency**: AI insight quality directly depends on the substance of retrieved audience feedback.
- **In-Memory Cache Lifecycle**: In-memory (L1) cache entries reset when serverless instances recycle (mitigated by configuring PostgreSQL L2 cache).

---

## About the Maker

**Vedaang Sharma**  
Full-stack developer · AI enthusiast

POP is a passion project exploring how real audience evidence and AI-generated synthesis can be combined into a transparent, joyful movie discovery experience.

- **GitHub**: [github.com/vedaangsharma2006](https://github.com/vedaangsharma2006)
- **LinkedIn**: [linkedin.com/in/vedaang-sharma](https://www.linkedin.com/in/vedaang-sharma)
- **Email**: [vedaangsharma2006@gmail.com](mailto:vedaangsharma2006@gmail.com)

---

## Project Pages

- **Live Application**: [https://pop.vedaangsharma.in/](https://pop.vedaangsharma.in/)
- **About POP**: [https://pop.vedaangsharma.in/about](https://pop.vedaangsharma.in/about)
- **Privacy Policy**: [https://pop.vedaangsharma.in/privacy](https://pop.vedaangsharma.in/privacy)
- **Contact**: [https://pop.vedaangsharma.in/contact](https://pop.vedaangsharma.in/contact)

---

## Attribution

- This product uses the TMDB API but is not endorsed or certified by TMDB. Learn more at [themoviedb.org](https://www.themoviedb.org/).
- Movie metadata and ratings powered by [OMDb API](https://www.omdbapi.com/).
- AI synthesis powered via [OpenRouter](https://openrouter.ai/).

---

## License

MIT License. Built for modern cinematic audience intelligence.
