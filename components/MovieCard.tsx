import type { Movie } from "@/types/movie";
import { motion } from "framer-motion";

type MovieCardProps = {
  movie: Movie;
  reviewCount: number;
};

export default function MovieCard({ movie, reviewCount }: MovieCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[200px_1fr] lg:items-start">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 shadow-sm lg:w-[200px]">
          {movie.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">No poster</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-zinc-900">{movie.title}</h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">{movie.year}</span>
            <span className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              ★ {movie.rating}
            </span>
            <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {reviewCount} reviews
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600">{movie.plot}</p>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Cast</p>
            <div className="flex flex-wrap gap-1.5">
              {movie.cast.length > 0 ? (
                movie.cast.map((member) => (
                  <span key={member} className="rounded-lg bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                    {member}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
