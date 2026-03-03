import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  reviewCount: number;
};

export default function MovieCard({ movie, reviewCount }: MovieCardProps) {
  return (
    <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-[160px_1fr] sm:gap-6 sm:p-6">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
        {movie.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={movie.poster} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-56 items-center justify-center text-sm text-zinc-400">No poster</div>
        )}
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
        <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
          <span className="rounded-full bg-white/10 px-3 py-1">Year: {movie.year}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">IMDb: {movie.rating}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Reviews: {reviewCount}</span>
        </div>
        <p className="text-sm leading-6 text-zinc-200">{movie.plot}</p>
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-zinc-100">Cast:</span> {movie.cast.join(", ") || "N/A"}
        </p>
      </div>
    </section>
  );
}
