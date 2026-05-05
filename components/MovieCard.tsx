import { useRef, useEffect } from "react";
import gsap from "gsap";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
  reviewCount: number;
};

export default function MovieCard({ movie, reviewCount }: MovieCardProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.fromTo(".mc-poster",
        { x: -28, opacity: 0, scale: 0.93 },
        { x: 0, opacity: 1, scale: 1, duration: 0.62 }
      )
      .fromTo(".mc-title",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "<0.12"
      )
      .fromTo(".mc-badge",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4 },
        "<0.08"
      )
      .fromTo(".mc-plot",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "<0.1"
      )
      .fromTo(".mc-cast-label",
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        "<0.12"
      )
      .fromTo(".mc-cast-chip",
        { scale: 0.78, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.045, duration: 0.32 },
        "<0.05"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-start">
        <div className="mc-poster aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 shadow-sm lg:w-[180px]">
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
          <h2 className="mc-title text-2xl font-bold leading-snug tracking-tight text-zinc-900">
            {movie.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mc-badge rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {movie.year}
            </span>
            <span className="mc-badge rounded-lg border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              ★ {movie.rating}
            </span>
            <span className="mc-badge rounded-lg bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {reviewCount} reviews
            </span>
          </div>

          <p className="mc-plot text-sm leading-relaxed text-zinc-600">{movie.plot}</p>

          <div className="space-y-2">
            <p className="mc-cast-label text-xs font-semibold uppercase tracking-widest text-zinc-400">Cast</p>
            <div className="flex flex-wrap gap-1.5">
              {movie.cast.length > 0 ? (
                movie.cast.map((member) => (
                  <span key={member} className="mc-cast-chip rounded-lg bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
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
    </section>
  );
}
