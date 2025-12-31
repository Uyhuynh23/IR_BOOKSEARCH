import type { FormEvent } from 'react';
import { useMemo } from 'react';
import type { Book, SearchFilters } from '../types';

interface SearchPageProps {
  books: Book[];
  filters: SearchFilters;
  query: string;
  onUpdateFilters: (filters: Partial<SearchFilters>) => void;
  onSearch: (query: string) => void;
  onChangeQuery: (value: string) => void;
}

export default function SearchPage({
  books,
  filters,
  query,
  onUpdateFilters,
  onSearch,
  onChangeQuery,
}: SearchPageProps) {
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    books.forEach((b) => (b.categorization?.genres_normalized ?? []).forEach((g) => genreSet.add(g)));
    return Array.from(genreSet).sort();
  }, [books]);

  const allLanguages = useMemo(() => {
    const langSet = new Set<string>();
    books.forEach((b) => langSet.add(b.core_metadata.language ?? 'en'));
    return ['All', ...Array.from(langSet).sort()];
  }, [books]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="page-shell">
      <div className="header">
        <h1>📚 Book Search System</h1>
        <p className="muted">Find your next favorite story</p>
      </div>

      <form className="search-card" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="search-input">
          Search titles, authors, or keywords
        </label>
        <input
          id="search-input"
          className="search-input"
          placeholder="Search titles, authors, or keywords..."
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
        />
        <button type="submit" className="primary">
          🔍 Search
        </button>
      </form>

      <div className="filter-card">
        <h3>🛠️ Refine Search</h3>

        <div className="filter-row">
          <div className="field">
            <label>Genre</label>
            <select
              multiple
              value={filters.genres}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                onUpdateFilters({ genres: selected });
              }}
            >
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <small className="muted">Hold Ctrl/Cmd to select multiple</small>
          </div>

          <div className="field">
            <label>Language</label>
            <select value={filters.language} onChange={(e) => onUpdateFilters({ language: e.target.value })}>
              {allLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="field">
            <label>Min Rating</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating}
              onChange={(e) => onUpdateFilters({ minRating: Number(e.target.value) })}
            />
            <div className="muted">Current: {filters.minRating.toFixed(1)} ⭐</div>
          </div>

          <div className="field">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={filters.yearEnabled}
                onChange={(e) => onUpdateFilters({ yearEnabled: e.target.checked })}
              />
              Apply Year Filter
            </label>
            <div className="year-range">
              <input
                type="number"
                value={filters.yearMin}
                onChange={(e) => onUpdateFilters({ yearMin: Number(e.target.value) })}
                disabled={!filters.yearEnabled}
              />
              <span className="muted">to</span>
              <input
                type="number"
                value={filters.yearMax}
                onChange={(e) => onUpdateFilters({ yearMax: Number(e.target.value) })}
                disabled={!filters.yearEnabled}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

