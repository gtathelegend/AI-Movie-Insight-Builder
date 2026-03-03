type SearchBarProps = {
  imdbID: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function SearchBar({ imdbID, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <section className="w-full rounded-2xl border border-white/60 bg-white/85 p-4 shadow-md backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          suppressHydrationWarning
          value={imdbID}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Enter IMDb ID (e.g., tt0133093)"
          className="h-14 flex-1 rounded-full border border-slate-200 bg-white px-6 text-base text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15"
          aria-label="IMDb ID"
        />
        <button
          suppressHydrationWarning
          onClick={onSubmit}
          disabled={loading}
          className="h-14 rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-md transition duration-300 hover:scale-[1.03] hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </section>
  );
}
