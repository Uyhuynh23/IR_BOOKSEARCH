import { useState } from "react";
import type { SearchFilters } from "../types";
import SearchBar from "./SearchBar";

interface SearchPageProps {
  query: string;
  filters: SearchFilters;
  onChangeQuery: (value: string) => void;
  onUpdateFilters: (filters: Partial<SearchFilters>) => void;
  onSearch: (query: string) => void;
}

export default function SearchPage({
  query,
  filters,
  onChangeQuery,
  onUpdateFilters,
  onSearch,
}: SearchPageProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const handleSubmit = () => {
    onSearch(query);
  };

  const handleQuickSearch = (quickQuery: string) => {
    onChangeQuery(quickQuery);
  };

  const handleClearFilters = () => {
    onUpdateFilters({
      genres: [],
      author: "",
      minRating: 0,
      yearMin: 1900,
      yearMax: new Date().getFullYear(),
      language: "All",
    });
  };

  const genreOptions = [
    "Fiction",
    "Non-fiction",
    "History",
    "Science",
    "Children",
    "Culture",
  ];
  const languageOptions = [
    "All",
    "Vietnamese",
    "English",
    "French",
    "Japanese",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(196,30,58,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.75rem" }}>📚</span>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#2B2B2B",
                lineHeight: 1.2,
              }}
            >
              Book Search System
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#C41E3A",
                fontWeight: 500,
              }}
            >
              Explore Knowledge • Celebrate Culture
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
            title="Language"
          >
            🌐
          </button>
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
            }}
            title="Profile"
          >
            👤
          </button>
        </div>
      </header>

      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Hero Search Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 700,
              color: "#2B2B2B",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Discover Your{" "}
            <span style={{ color: "#C41E3A" }}>Next Great Read</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#C41E3A",
              marginBottom: "2rem",
              fontWeight: 500,
            }}
          >
            Tìm sách hay – Khai xuân tri thức
          </p>

          {/* Search Bar Component */}
          <SearchBar
            query={query}
            onChangeQuery={onChangeQuery}
            onSubmit={handleSubmit}
            autoFocus
            placeholder="Nhập tên sách, tác giả hoặc mô tả…"
          />

          {/* Trending Quick Suggestions */}
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6B7280",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              Trending:
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                "Sách Tết",
                "Văn học Việt",
                "Tiểu thuyết",
                "Khoa học viễn tưởng",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickSearch(tag)}
                  style={{
                    background:
                      tag === "Sách Tết"
                        ? "linear-gradient(90deg, #C41E3A 60%, #F5C77A 100%)"
                        : "#fff",
                    color: tag === "Sách Tết" ? "#fff" : "#C41E3A",
                    border: tag === "Sách Tết" ? "none" : "1.5px solid #F5C77A",
                    borderRadius: "24px",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      tag === "Sách Tết"
                        ? "0 2px 8px rgba(196,30,58,0.1)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (tag !== "Sách Tết") {
                      e.currentTarget.style.background = "#C41E3A";
                      e.currentTarget.style.color = "#fff";
                    } else {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tag !== "Sách Tết") {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#C41E3A";
                    } else {
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filter Panel (Collapsible) */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
            marginBottom: "3rem",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFDF8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ fontSize: "1.25rem" }}>#</span>
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#2B2B2B",
                }}
              >
                Advanced Search Filters
              </h3>
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                transform: filtersExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              ⌄
            </span>
          </button>

          {filtersExpanded && (
            <div
              style={{
                padding: "0 1.5rem 1.5rem",
                animation: "slideDown 0.3s ease-out",
              }}
            >
              {/* Genres */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "#2B2B2B",
                    fontSize: "0.95rem",
                  }}
                >
                  GENRES
                </label>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {genreOptions.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        const newGenres = filters.genres.includes(genre)
                          ? filters.genres.filter((g) => g !== genre)
                          : [...filters.genres, genre];
                        onUpdateFilters({ genres: newGenres });
                      }}
                      style={{
                        background: filters.genres.includes(genre)
                          ? "#C41E3A"
                          : "#fff",
                        color: filters.genres.includes(genre)
                          ? "#fff"
                          : "#C41E3A",
                        border: "1.5px solid #C41E3A",
                        borderRadius: "20px",
                        padding: "0.4rem 1rem",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two-column layout for other filters */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Author */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#2B2B2B",
                      fontSize: "0.95rem",
                    }}
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    value={filters.author}
                    onChange={(e) =>
                      onUpdateFilters({ author: e.target.value })
                    }
                    placeholder="e.g. Nguyễn Nhật Ánh"
                    style={{
                      width: "100%",
                      margin: 0,
                    }}
                  />
                </div>

                {/* Language */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#2B2B2B",
                      fontSize: "0.95rem",
                    }}
                  >
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) =>
                      onUpdateFilters({ language: e.target.value })
                    }
                    style={{
                      width: "100%",
                      margin: 0,
                      cursor: "pointer",
                    }}
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year Range */}
              <div style={{ marginTop: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    color: "#2B2B2B",
                    fontSize: "0.95rem",
                  }}
                >
                  Year Range
                </label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      From
                    </label>
                    <input
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={filters.yearMin}
                      onChange={(e) =>
                        onUpdateFilters({ yearMin: Number(e.target.value) })
                      }
                      placeholder="1900"
                      style={{
                        width: "100%",
                        margin: 0,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "#C41E3A",
                      marginTop: "1.5rem",
                    }}
                  >
                    –
                  </span>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        marginBottom: "0.25rem",
                      }}
                    >
                      To
                    </label>
                    <input
                      type="number"
                      min={1900}
                      max={new Date().getFullYear()}
                      value={filters.yearMax}
                      onChange={(e) =>
                        onUpdateFilters({ yearMax: Number(e.target.value) })
                      }
                      placeholder={String(new Date().getFullYear())}
                      style={{
                        width: "100%",
                        margin: 0,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div style={{ marginTop: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#2B2B2B",
                    fontSize: "0.95rem",
                  }}
                >
                  Minimum Rating
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onUpdateFilters({ minRating: star })}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        filter:
                          star <= filters.minRating
                            ? "none"
                            : "grayscale(100%)",
                        opacity: star <= filters.minRating ? 1 : 0.3,
                        transition: "all 0.2s",
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={handleClearFilters}
                  className="button-outline"
                  style={{ padding: "0.6rem 1.5rem" }}
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => onSearch(query)}
                  className="button-primary"
                  style={{ padding: "0.75rem 2rem" }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Section */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <div
            style={{
              width: "200px",
              height: "200px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(196,30,58,0.12)",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
              }}
            >
              🌸
            </div>
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "10%",
                fontSize: "2rem",
              }}
            >
              🎆
            </div>
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#2B2B2B",
              marginBottom: "0.5rem",
            }}
          >
            Happy Lunar New Year!
          </h2>
          <p
            style={{
              fontSize: "1rem",
              color: "#6B7280",
              lineHeight: 1.6,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Start by typing in the search bar above to explore our
            <br />
            collection of festive reads, classics, and modern bestsellers.
          </p>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "4rem",
            paddingTop: "2rem",
            borderTop: "2px solid #F5C77A",
            textAlign: "center",
            color: "#6B7280",
            fontSize: "0.9rem",
          }}
        >
          <div
            style={{ display: "flex", gap: "2rem", justifyContent: "center" }}
          >
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              Privacy
            </a>
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              Terms
            </a>
          </div>
          <p style={{ marginTop: "1rem" }}>© 2024 BookSearch System</p>
        </footer>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
