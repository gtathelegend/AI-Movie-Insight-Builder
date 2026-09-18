import type { MetadataRoute } from "next";
import { getTrendingMoviesServer, getNowPlayingMoviesServer } from "@/lib/tmdb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://pop.vedaangsharma.in";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/movies/now-showing`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
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
        movieMap.set(m.imdbId.toLowerCase(), `${baseUrl}/movie/${m.imdbId.toLowerCase()}`);
      }
    });

    // Known popular benchmark films for rich crawl coverage
    const benchmarkIds = ["tt0133093", "tt1375666", "tt0816692", "tt0468569", "tt0111161", "tt0068646"];
    benchmarkIds.forEach((id) => {
      if (!movieMap.has(id)) {
        movieMap.set(id, `${baseUrl}/movie/${id}`);
      }
    });

    const movieRoutes: MetadataRoute.Sitemap = Array.from(movieMap.values()).map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...movieRoutes];
  } catch {
    return staticRoutes;
  }
}
