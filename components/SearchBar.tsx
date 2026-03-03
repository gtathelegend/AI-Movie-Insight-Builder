type SearchBarProps = {
  imdbID: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function SearchBar({ imdbID, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={imdbID}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Enter IMDb ID (e.g., tt0133093)"
          className="h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          aria-label="IMDb ID"
        />
        <button
          onClick={onSubmit}
          disabled={loading}
          className="h-12 rounded-lg bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </section>
  );
}
