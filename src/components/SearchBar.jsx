
import { Search, X } from "lucide-react";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const handleClear = () => onChange?.("");

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 transition-colors focus-within:border-[var(--primary)] ${className}`}
    >
      <Search
        size={19}
        className="shrink-0 text-[var(--text-muted)]"
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 border-none bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="shrink-0 rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
