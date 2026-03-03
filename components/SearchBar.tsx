type SearchBarProps = {
  imdbID: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function SearchBar({ imdbID, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={imdbID}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Enter IMDb ID (e.g., tt0133093)"
          className="h-12 flex-1 rounded-xl border border-white/15 bg-black/20 px-4 text-sm text-white placeholder:text-zinc-400 outline-none ring-0 focus:border-sky-400"
          aria-label="IMDb ID"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="h-12 rounded-xl bg-sky-500 px-6 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
}
