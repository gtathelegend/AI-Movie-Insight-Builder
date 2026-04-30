type SearchBarProps = {
  imdbID: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export default function SearchBar({ imdbID, onChange, onSubmit, loading }: SearchBarProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          suppressHydrationWarning
          value={imdbID}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit();
          }}
          placeholder="Enter IMDb ID (e.g. tt0133093)"
          className="h-12 flex-1 rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10"
          aria-label="IMDb ID"
        />
        <button
          suppressHydrationWarning
          onClick={onSubmit}
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-7 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
    </div>
  );
}
