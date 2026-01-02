import { useState, useEffect } from "react";
import type { Book } from "../types";
import SearchBar from "./SearchBar";
import BookCard from "./BookCard";
import FloatingElements from "./results/FloatingElements";
import ResultsHeader from "./results/ResultsHeader";
import ActiveFilters from "./results/ActiveFilters";
import CategorySidebar from "./results/CategorySidebar";
import EmptyState from "./results/EmptyState";
import RelatedSearches from "./results/RelatedSearches";
import Pagination from "./results/Pagination";

interface ResultsPageProps {
  results: Book[];
  query: string;
  onBack: () => void;
  onSearchAgain: (query: string) => void;
  onSelectBook?: (bookId: number) => void;
}

export default function ResultsPage({
  results,
  query,
  onBack,
  onSearchAgain,
  onSelectBook,
}: ResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [floatingElements, setFloatingElements] = useState<
    Array<{
      id: number;
      type: string;
      x: number;
      delay: number;
      duration: number;
    }>
  >([]);
  const booksPerPage = 12;

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate floating decorative elements on mount
  useEffect(() => {
    const elements = [
      ...Array.from({ length: 8 }, (_, i) => ({
        id: i,
        type: "blossom",
        x: i < 4 ? 5 + Math.random() * 10 : 85 + Math.random() * 10,
        delay: Math.random() * 5,
        duration: 15 + Math.random() * 10,
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        id: i + 8,
        type: "lixi",
        x: i < 2 ? 8 + Math.random() * 8 : 84 + Math.random() * 8,
        delay: Math.random() * 8,
        duration: 20 + Math.random() * 15,
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 12,
        type: "lantern",
        x: i === 0 ? 10 : i === 1 ? 50 : 90,
        delay: Math.random() * 6,
        duration: 25 + Math.random() * 10,
      })),
    ];
    setFloatingElements(elements);
  }, []);

  // Extract unique categories from results
  const availableCategories = Array.from(
    new Set(results.map((book) => book.google_category).filter(Boolean))
  ).slice(0, 8);

  // Filter books by selected categories
  const filteredResults =
    selectedCategories.length > 0
      ? results.filter((book) =>
          selectedCategories.some((cat) =>
            book.google_category?.toLowerCase().includes(cat.toLowerCase())
          )
        )
      : results;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      onSearchAgain(searchQuery);
      setCurrentPage(1);
    }
  };

  const toggleFavorite = (bookId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const relatedSearches = [
    "Văn học Tết",
    "Lí sử sách",
    "Horror",
    "Tiểu thuyết trinh thám",
  ];

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredResults.slice(startIndex, endIndex);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFDF8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingElements elements={floatingElements} windowWidth={windowWidth} />
      {/* Top Search Bar */}
      <header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(196,30,58,0.08)",
          paddingTop: "1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* Back Arrow Button */}
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              color: "#C41E3A",
              fontSize: "1.5rem",
              transition: "transform 0.2s",
              marginBottom: "22px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateX(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateX(0)")
            }
            title="Back to search"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Search Bar */}
          <div style={{ flex: 1 }}>
            <SearchBar
              query={searchQuery}
              onChangeQuery={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search for books..."
            />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <ResultsHeader
          filteredCount={filteredResults.length}
          totalCount={results.length}
          query={query}
          hasFilters={selectedCategories.length > 0}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <ActiveFilters
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClearAll={clearAllFilters}
        />

        {/* Main Content with Sidebar */}
        <div style={{ display: "flex", gap: "2rem", position: "relative" }}>
          <CategorySidebar
            categories={availableCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            windowWidth={windowWidth}
          />

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Book Grid */}
            {currentBooks.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.5rem",
                  marginBottom: "3rem",
                }}
              >
                {currentBooks.map((book) => (
                  <BookCard
                    key={book.bookID}
                    book={book}
                    isFavorite={favorites.has(book.bookID)}
                    onToggleFavorite={toggleFavorite}
                    onSelectBook={onSelectBook}
                  />
                ))}
              </div>
            )}

            {results.length > 0 && (
              <RelatedSearches
                searches={relatedSearches}
                onSearch={onSearchAgain}
              />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            paddingTop: "2rem",
            borderTop: "2px solid #F5C77A",
            textAlign: "center",
            color: "#6B7280",
            fontSize: "0.9rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              Terms
            </a>
          </div>
          <p style={{ margin: 0 }}>© 2024 BookSearch. Chúc Mừng Năm Mới!</p>
        </footer>
      </div>
    </div>
  );
}
