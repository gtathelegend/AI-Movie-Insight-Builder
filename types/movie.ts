export type Movie = {
  title: string;
  poster: string;
  year: string;
  rating: string;
  plot: string;
  cast: string[];
};

export type MovieResponse = {
  movie: Movie;
  reviews: string[];
};
