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
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm md:w-48 md:shrink-0">
        {movie.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={movie.poster} alt={`${movie.title} poster`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-slate-500 md:h-full">No poster</div>
        )}
      </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">{movie.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">Year: {movie.year}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">IMDb: {movie.rating}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Reviews: {reviewCount}</span>
          </div>
          <p className="text-base leading-relaxed text-slate-600">{movie.plot}</p>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-800">Cast</p>
            <div className="flex flex-wrap gap-2">
              {movie.cast.length > 0 ? (
                movie.cast.map((member) => (
                  <span key={member} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {member}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
