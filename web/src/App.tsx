import { useEffect, useMemo, useState } from 'react';
import DetailPage from './components/DetailPage';
import ResultsPage from './components/ResultsPage';
import SearchPage from './components/SearchPage';
import type { Book, SearchFilters } from './types';
import { searchBooks } from './utils/search';

type View = 'search' | 'results' | 'detail';

const defaultFilters: SearchFilters = {
  genres: [],
  language: 'All',
  minRating: 0,
  yearEnabled: false,
  yearMin: 1800,
  yearMax: 2025,
};

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [view, setView] = useState<View>('search');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/mock_books.json');
        if (!res.ok) throw new Error('Failed to load mock_books.json');
        const data = (await res.json()) as Book[];
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (view === 'results' && query) {
      setResults(searchBooks(query, books, filters));
    }
  }, [filters, books, query, view]);

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    if (nextQuery.trim()) {
      const found = searchBooks(nextQuery, books, filters);
      setResults(found);
      setView('results');
    }
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setView('detail');
  };

  const handleBackToResults = () => setView('results');

  const handleUpdateFilters = (update: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  if (loading) return <div className="page-shell">Loading books…</div>;
  if (error) return <div className="page-shell error">Error: {error}</div>;

  return (
    <main className="app-shell">
      {view === 'search' && (
        <SearchPage
          books={books}
          filters={filters}
          query={query}
          onUpdateFilters={handleUpdateFilters}
          onSearch={handleSearch}
          onChangeQuery={setQuery}
        />
      )}

      {view === 'results' && (
        <ResultsPage
          query={query}
          filters={filters}
          results={results}
          onBack={() => setView('search')}
          onSearchAgain={handleSearch}
          onSelectBook={handleSelectBook}
        />
      )}

      {view === 'detail' && <DetailPage book={selectedBook} onBack={handleBackToResults} />}
    </main>
  );
}

