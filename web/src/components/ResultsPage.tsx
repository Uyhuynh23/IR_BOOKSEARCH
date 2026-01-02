import { useState } from "react";
import type { Book } from "../types";
import SearchBar from "./SearchBar";

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
  const booksPerPage = 12;

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

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; color: string }> = {
      Fiction: { label: "TIỂU THUYẾT", color: "#C41E3A" },
      Mystery: { label: "TRINH THÁM", color: "#C41E3A" },
      Thriller: { label: "KINH DỊ", color: "#8B0000" },
      Romance: { label: "LÃNG MẠN", color: "#FF69B4" },
      "Science Fiction": { label: "KHOA HỌC", color: "#1F7A63" },
      Fantasy: { label: "VIỄN TƯỞNG", color: "#9370DB" },
      History: { label: "LỊCH SỬ", color: "#8B4513" },
      "Non-fiction": { label: "PHI TIỂU THUYẾT", color: "#6B7280" },
    };

    const match = Object.entries(categoryMap).find(([key]) =>
      category?.toLowerCase().includes(key.toLowerCase())
    );

    return match ? match[1] : { label: "SÁCH", color: "#6B7280" };
  };

  const relatedSearches = [
    "Văn học Tết",
    "Lí sử sách",
    "Horror",
    "Tiểu thuyết trinh thám",
  ];

  // Pagination
  const totalPages = Math.ceil(results.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = results.slice(startIndex, endIndex);

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
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
            maxWidth: "900px",
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

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
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
            Tìm thấy {results.length} cuốn sách cho{" "}
            <span style={{ color: "#C41E3A" }}>'{query}'</span>
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
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {currentBooks.map((book) => {
              const badge = getCategoryBadge(book.google_category);
              const isFavorite = favorites.has(book.bookID);

              return (
                <div
                  key={book.bookID}
                  onClick={() => onSelectBook?.(book.bookID)}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(196,30,58,0.16)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(196,30,58,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Book Cover */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "150%",
                      background:
                        "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        book.thumbnail ||
                        "https://via.placeholder.com/200x300?text=No+Cover"
                      }
                      alt={book.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    {/* Favorite Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book.bookID);
                      }}
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "2rem",
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        fontSize: "1.1rem",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      {isFavorite ? "❤️" : "🤍"}
                    </button>
                  </div>

                  {/* Book Info */}
                  <div style={{ padding: "1rem" }}>
                    {/* Category Badge */}
                    <div
                      style={{
                        display: "inline-block",
                        background: badge.color,
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        marginBottom: "0.5rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {badge.label}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#2B2B2B",
                        marginBottom: "0.25rem",
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.6em",
                      }}
                    >
                      {book.title}
                    </h3>

                    {/* Author */}
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        marginBottom: "0.5rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {book.authors}
                    </p>

                    {/* Rating */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "0.9rem",
                            filter:
                              i < Math.floor(book.average_rating)
                                ? "none"
                                : "grayscale(100%)",
                            opacity:
                              i < Math.floor(book.average_rating) ? 1 : 0.3,
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          marginLeft: "0.25rem",
                        }}
                      >
                        ({book.average_rating})
                      </span>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        marginBottom: "1rem",
                        minHeight: "2.8em",
                      }}
                    >
                      {book.description || "Chưa có mô tả cho cuốn sách này."}
                    </p>

                    {/* View Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBook?.(book.bookID);
                      }}
                      className="button-outline"
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Related Search Suggestions */}
        {results.length > 0 && (
          <div
            style={{
              background: "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)",
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
                    background: currentPage === pageNum ? "#C41E3A" : "#fff",
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.3 : 1,
                color: "#C41E3A",
              }}
            >
              ›
            </button>
          </div>
        )}

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
