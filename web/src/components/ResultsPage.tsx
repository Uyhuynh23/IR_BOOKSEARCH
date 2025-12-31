import type { FormEvent } from 'react';
import type { Book, SearchFilters } from '../types';
import { formatGenres, getPlaceholderImage } from '../utils/search';

interface ResultsPageProps {
  results: Book[];
  query: string;
  filters: SearchFilters;
  onBack: () => void;
  onSearchAgain: (query: string) => void;
  onSelectBook: (bookId: string) => void;
}

export default function ResultsPage({
  results,
  query,
  filters,
  onBack,
  onSearchAgain,
  onSelectBook,
}: ResultsPageProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSearchAgain(String(formData.get('query') ?? ''));
  };

  return (
    <div className="page-shell">
      <button className="ghost" onClick={onBack}>
        ← Back to Search
      </button>

      <form className="search-card inline" onSubmit={handleSubmit}>
        <input name="query" defaultValue={query} className="search-input" placeholder="Search again..." />
        <button type="submit" className="primary">
          🔍 Search
        </button>
      </form>

      {results.length ? (
        <h2>
          Found {results.length} books matching &ldquo;{query}&rdquo;
          <span className="muted inline-block">
            {' '}
            • Rating ≥ {filters.minRating.toFixed(1)}
            {filters.yearEnabled ? ` • Years ${filters.yearMin}-${filters.yearMax}` : ''}
            {filters.language !== 'All' ? ` • ${filters.language}` : ''}
          </span>
        </h2>
      ) : (
        <div className="empty">📭 No books found matching &ldquo;{query}&rdquo;</div>
      )}

      <div className="results-list">
        {results.map((book) => {
          const isbn = book.identifiers?.isbn_13 ?? book.identifiers?.isbn_10;
          const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : getPlaceholderImage();
          const title = book.core_metadata.title ?? 'Unknown Title';
          const author = book.core_metadata.author ?? 'Unknown Author';
          const genres = book.categorization?.genres_cmu ?? [];

          return (
            <div key={book.id} className="book-card">
              <div className="book-card-body">
                <img src={coverUrl} alt={title} className="book-cover" />
                <div>
                  <div className="book-title">{title}</div>
                  <div className="book-author">by {author}</div>
                  {genres.length ? (
                    <div
                      className="genre-row"
                      dangerouslySetInnerHTML={{ __html: `🏷️ ${formatGenres(genres)}` }}
                    />
                  ) : null}
                  <button className="secondary" onClick={() => onSelectBook(book.id)}>
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

