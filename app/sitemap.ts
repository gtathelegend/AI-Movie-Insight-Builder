import type { MetadataRoute } from "next";
import { getTrendingMoviesServer, getNowPlayingMoviesServer } from "@/lib/tmdb";
import { isValidImdbId } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pop.vedaangsharma.in";
  const releaseDate = new Date("2026-03-18T00:00:00.000Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: releaseDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: releaseDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/trending`,
      lastModified: releaseDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/now-showing`,
      lastModified: releaseDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: releaseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch live movies from TMDb to index canonical movie pages
  try {
    const [trending, nowPlaying] = await Promise.all([
      getTrendingMoviesServer(),
      getNowPlayingMoviesServer(),
    ]);

    const movieMap = new Map<string, string>();

    [...trending, ...nowPlaying].forEach((m) => {
      if (m.imdbId) {
        const id = m.imdbId.toLowerCase().trim();
        if (isValidImdbId(id)) {
          movieMap.set(id, `${baseUrl}/movie/${id}`);
        }
      }
    });

    // Known popular benchmark films for rich crawl coverage
    const benchmarkIds = ["tt0133093", "tt1375666", "tt0816692", "tt0468569", "tt0111161", "tt0068646"];
    benchmarkIds.forEach((id) => {
      const normalized = id.toLowerCase().trim();
      if (isValidImdbId(normalized) && !movieMap.has(normalized)) {
        movieMap.set(normalized, `${baseUrl}/movie/${normalized}`);
      }
    });

    const movieRoutes: MetadataRoute.Sitemap = Array.from(movieMap.values()).map((url) => ({
      url,
      lastModified: releaseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...movieRoutes];
  } catch {
    return staticRoutes;
  }
}
