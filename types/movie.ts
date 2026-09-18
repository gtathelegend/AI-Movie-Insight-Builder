export type Movie = {
  title: string;
  poster: string;
  year: string;
  rating: string;
  plot: string;
  cast: string[];
  genre?: string;
  director?: string;
  runtime?: string;
  metascore?: string;
  rottenTomatoes?: string;
};

export type ReviewSource = "tmdb" | "imdb";

export type ReviewData = {
  reviews: string[];
  sources: ReviewSource[];
  collectedCount: number;
};

export type MovieResponse = {
  movie: Movie;
  reviews: string[];
  sources?: ReviewSource[];
  collectedCount?: number;
  hasReviews?: boolean;
};
