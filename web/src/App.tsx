import { useState } from "react";
import { searchBooks } from "./utils/search";
import type { Book, SearchFilters } from "./types";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";
import DetailPage from "./components/DetailPage";
import "./style.css";

type AppView = "search" | "results" | "detail";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>("search");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    genres: [],
    author: "",
    minRating: 0,
    yearMin: 1900,
    yearMax: new Date().getFullYear(),
    language: "All",
  });

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setCurrentView("results");
    const results = await searchBooks(searchQuery, filters);
    setBooks(results);
    setLoading(false);
  };

  const handleUpdateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBackToSearch = () => {
    setCurrentView("search");
    setSelectedBook(null);
  };

  const handleBackToResults = () => {
    setCurrentView("results");
    setSelectedBook(null);
  };

  const handleSelectBook = (bookId: number) => {
    const book = books.find((b) => b.bookID === bookId);
    if (book) {
      setSelectedBook(book);
      setCurrentView("detail");
    }
  };

  // Get related books (simple: same category, different book)
  const getRelatedBooks = (book: Book): Book[] => {
    return books
      .filter(
        (b) =>
          b.bookID !== book.bookID && b.google_category === book.google_category
      )
      .slice(0, 5);
  };

  // Show SearchPage
  if (currentView === "search") {
    return (
      <SearchPage
        query={query}
        filters={filters}
        onChangeQuery={setQuery}
        onUpdateFilters={handleUpdateFilters}
        onSearch={handleSearch}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFDF8",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "spin 2s linear infinite",
            }}
          >
            🌸
          </div>
          <p style={{ fontSize: "1.2rem", color: "#C41E3A", fontWeight: 600 }}>
            Đang tìm kiếm sách...
          </p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show DetailPage
  if (currentView === "detail" && selectedBook) {
    return (
      <DetailPage
        book={selectedBook}
        relatedBooks={getRelatedBooks(selectedBook)}
        onBack={handleBackToResults}
        onSelectBook={handleSelectBook}
      />
    );
  }

  // Show ResultsPage
  return (
    <ResultsPage
      results={books}
      query={query}
      onBack={handleBackToSearch}
      onSearchAgain={handleSearch}
      onSelectBook={handleSelectBook}
    />
  );
}

export default App;
