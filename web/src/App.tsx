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
  const [hasFiltersApplied, setHasFiltersApplied] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    genres: [],
    author: "",
    minRating: 0,
    yearMin: 1900,
    yearMax: new Date().getFullYear(),
    language: "All",
  });

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    setCurrentView("results");
    setQuery(searchQuery);
    setScrollPosition(0);
    const results = await searchBooks(searchQuery, filters);
    setBooks(results);
    setLoading(false);
  };

  const handleUpdateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleFiltersApplied = (applied: boolean) => {
    setHasFiltersApplied(applied);
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
    // Save scroll position before navigating away from results
    setScrollPosition(window.scrollY);
    
    // First, check if book is in current results
    let book = books.find((b) => (b.bookID || b.book_id) === bookId);
    
    if (book) {
      setSelectedBook(book);
      setCurrentView("detail");
    } else {
      // If not found in current results, create a placeholder with just the ID
      // The detail page will load the full data from the recommendation API
      console.log("⚠️ Book", bookId, "not in current results, using placeholder");
      const placeholderBook: Book = {
        bookID: bookId,
        title: "Loading...",
        authors: "",
        average_rating: 0,
        clean_isbn: "",
        description: "",
        published_year: "",
        thumbnail: "",
        google_category: "",
        preview_link: "",
      };
      setSelectedBook(placeholderBook);
      setCurrentView("detail");
    }
  };

  // Get related books (simple: same category, different book)
  const getRelatedBooks = (book: Book): Book[] => {
    const currentBookId = book.bookID || book.book_id;
    return books
      .filter(
        (b) =>
          (b.bookID || b.book_id) !== currentBookId && b.google_category === book.google_category
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
        hasFiltersApplied={hasFiltersApplied}
        onFiltersApplied={handleFiltersApplied}
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
      filters={filters}
      onUpdateFilters={handleUpdateFilters}
      hasFiltersApplied={hasFiltersApplied}
      onFiltersApplied={handleFiltersApplied}
      scrollPosition={scrollPosition}
      onScrollPositionChange={setScrollPosition}
    />
  );
}

export default App;
