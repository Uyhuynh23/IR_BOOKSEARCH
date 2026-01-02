import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Book } from "../types";
import SearchBar from "./SearchBar";
import BookCard from "./BookCard";

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
      {/* Floating Decorative Elements */}
      {floatingElements.map((elem) => (
        <motion.div
          key={elem.id}
          initial={{ y: "100vh", x: `${elem.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "-20vh",
            x: `${elem.x + Math.sin(elem.id) * 5}vw`,
            opacity: [0, 0.7, 0.7, 0],
            rotate:
              elem.type === "lixi"
                ? [0, 360]
                : elem.type === "lantern"
                ? [0, 15, -15, 0]
                : 360,
          }}
          transition={{
            duration: elem.duration,
            delay: elem.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "fixed",
            fontSize: elem.type === "lantern" ? "2.5rem" : "2rem",
            pointerEvents: "none",
            zIndex: 1,
            display: windowWidth < 1200 ? "none" : "block",
          }}
        >
          {elem.type === "blossom" ? "🌸" : elem.type === "lixi" ? "🧧" : "🏮"}
        </motion.div>
      ))}

      {/* Corner Flourishes */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle at 0% 0%, rgba(196,30,58,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          display: windowWidth < 1200 ? "none" : "block",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle at 100% 0%, rgba(245,199,122,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          display: windowWidth < 1200 ? "none" : "block",
        }}
      />
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
        {/* Results Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#2B2B2B",
              marginBottom: "0.5rem",
            }}
          >
            Tìm thấy {filteredResults.length} cuốn sách cho{" "}
            <span style={{ color: "#C41E3A" }}>'{query}'</span>
            {selectedCategories.length > 0 && (
              <span
                style={{ fontSize: "1rem", color: "#6B7280", fontWeight: 400 }}
              >
                {" "}
                (đã lọc từ {results.length})
              </span>
            )}
          </h1>

          {/* Sort Options */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "#6B7280" }}>
              Sắp xếp theo:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "1.5px solid #F5C77A",
                background: "#fff",
                color: "#2B2B2B",
                fontSize: "0.9rem",
                cursor: "pointer",
                outline: "none",
                margin: 0,
              }}
            >
              <option value="relevance">Độ liên quan</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="year">Năm xuất bản</option>
              <option value="title">Tên sách A-Z</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {selectedCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
              borderRadius: "12px",
              padding: "1rem 1.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2B2B2B" }}
            >
              Bộ lọc đang áp dụng:
            </span>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              {selectedCategories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(cat)}
                  style={{
                    background: "#C41E3A",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "0.4rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {cat}
                  <span style={{ fontSize: "1.1rem" }}>×</span>
                </motion.button>
              ))}
            </div>
            <button
              onClick={clearAllFilters}
              style={{
                background: "transparent",
                color: "#C41E3A",
                border: "1.5px solid #C41E3A",
                borderRadius: "20px",
                padding: "0.4rem 1rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Xóa tất cả
            </button>
          </motion.div>
        )}

        {/* Main Content with Sidebar */}
        <div style={{ display: "flex", gap: "2rem", position: "relative" }}>
          {/* Left Sidebar - Category Filters */}
          {windowWidth >= 1200 && availableCategories.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                width: "220px",
                flexShrink: 0,
                position: "sticky",
                top: "6rem",
                height: "fit-content",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🏷️</span>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#2B2B2B",
                    }}
                  >
                    Thể loại
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {availableCategories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleCategory(category)}
                      style={{
                        background: selectedCategories.includes(category)
                          ? "#C41E3A"
                          : "#fff",
                        color: selectedCategories.includes(category)
                          ? "#fff"
                          : "#2B2B2B",
                        border: `1.5px solid ${
                          selectedCategories.includes(category)
                            ? "#C41E3A"
                            : "#F5C77A"
                        }`,
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Book Grid */}
            {currentBooks.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
                }}
              >
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
                <h2 style={{ color: "#2B2B2B", marginBottom: "0.5rem" }}>
                  Không tìm thấy cuốn sách nào
                </h2>
                <p style={{ color: "#6B7280" }}>
                  Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                </p>
              </div>
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

            {/* Related Search Suggestions */}
            {results.length > 0 && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)",
                  borderRadius: "16px",
                  padding: "2rem",
                  marginBottom: "3rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>💡</span>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#2B2B2B",
                      margin: 0,
                    }}
                  >
                    Gợi ý tìm kiếm khác:
                  </h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {relatedSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => onSearchAgain(search)}
                      style={{
                        background: "#fff",
                        color: "#C41E3A",
                        border: "1.5px solid #F5C77A",
                        borderRadius: "24px",
                        padding: "0.5rem 1.25rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#C41E3A";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#C41E3A";
                      }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "3rem",
                }}
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.3 : 1,
                    color: "#C41E3A",
                  }}
                >
                  ‹
                </button>

                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          currentPage === pageNum ? "#C41E3A" : "#fff",
                        color: currentPage === pageNum ? "#fff" : "#2B2B2B",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow:
                          currentPage === pageNum
                            ? "0 2px 8px rgba(196,30,58,0.2)"
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = "#FFFDF8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.background = "#fff";
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span style={{ color: "#6B7280" }}>...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "8px",
                        border: "none",
                        background: "#fff",
                        color: "#2B2B2B",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.3 : 1,
                    color: "#C41E3A",
                  }}
                >
                  ›
                </button>
              </div>
            )}
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
