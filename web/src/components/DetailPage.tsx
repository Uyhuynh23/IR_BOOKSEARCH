import { useState } from "react";
import type { Book } from "../types";

interface DetailPageProps {
  book: Book;
  relatedBooks?: Book[];
  onBack: () => void;
  onSelectBook?: (bookId: number) => void;
}

export default function DetailPage({
  book,
  relatedBooks = [],
  onBack,
  onSelectBook,
}: DetailPageProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "metadata" | "reviews"
  >("description");
  const [isSaved, setIsSaved] = useState(false);

  const genres = book.google_category
    ? book.google_category
        .split(/[,;]/)
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const isClassic = book.published_year && parseInt(book.published_year) < 1950;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFDF8" }}>
      {/* Top Navigation */}
      <header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(196,30,58,0.08)",
          padding: "1rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "#C41E3A",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            ← Back to results
          </button>

          {/* Breadcrumbs */}
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6B7280",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              Home
            </a>
            <span>/</span>
            <a href="#" style={{ color: "#6B7280", textDecoration: "none" }}>
              {genres[0] || "Fiction"}
            </a>
            <span>/</span>
            <span style={{ color: "#2B2B2B" }}>{book.title}</span>
          </div>
        </div>
      </header>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Main Book Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Left: Book Cover */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1F7A63 0%, #0D5A48 100%)",
                borderRadius: "16px",
                padding: "1.5rem",
                boxShadow: "0 8px 32px rgba(31,122,99,0.2)",
              }}
            >
              {isClassic && (
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    left: "1rem",
                    background: "#F5C77A",
                    color: "#2B2B2B",
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 10,
                  }}
                >
                  ⭐ Classic
                </div>
              )}
              <img
                src={
                  book.thumbnail ||
                  "https://via.placeholder.com/300x450?text=No+Cover"
                }
                alt={book.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </div>

            {/* Decorative blossom */}
            <div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
                fontSize: "3rem",
                opacity: 0.2,
                zIndex: 0,
              }}
            >
              🌸
            </div>
          </div>

          {/* Right: Book Info */}
          <div>
            {/* Title */}
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#2B2B2B",
                marginBottom: "0.5rem",
                lineHeight: 1.2,
              }}
            >
              {book.title}
            </h1>

            {/* Author */}
            <p
              style={{
                fontSize: "1.25rem",
                color: "#C41E3A",
                marginBottom: "1rem",
              }}
            >
              by <span style={{ fontWeight: 600 }}>{book.authors}</span>
            </p>

            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "1.5rem",
                    filter:
                      i < Math.floor(book.average_rating)
                        ? "none"
                        : "grayscale(100%)",
                    opacity: i < Math.floor(book.average_rating) ? 1 : 0.3,
                  }}
                >
                  ⭐
                </span>
              ))}
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#2B2B2B",
                  marginLeft: "0.5rem",
                }}
              >
                {book.average_rating}
              </span>
              <span
                style={{
                  fontSize: "0.95rem",
                  color: "#6B7280",
                }}
              >
                (1,240 reviews)
              </span>
            </div>

            {/* Genre Badges */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              {genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  style={{
                    background: "#FFE5E5",
                    color: "#C41E3A",
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Metadata Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #F5C77A",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  PUBLISHED
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#2B2B2B",
                    fontWeight: 500,
                  }}
                >
                  {book.published_year || "Unknown"}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  LANGUAGE
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#2B2B2B",
                    fontWeight: 500,
                  }}
                >
                  Vietnamese
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  FORMAT
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#2B2B2B",
                    fontWeight: 500,
                  }}
                >
                  Hardcover, 324 pgs
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  ISBN
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    color: "#2B2B2B",
                    fontWeight: 500,
                  }}
                >
                  {book.clean_isbn || "Not available"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <button
                className="button-primary"
                style={{
                  flex: 1,
                  padding: "0.875rem 2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                📖 Read Preview
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                style={{
                  background: isSaved ? "#C41E3A" : "#fff",
                  color: isSaved ? "#fff" : "#C41E3A",
                  border: "2px solid #C41E3A",
                  borderRadius: "12px",
                  padding: "0.875rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {isSaved ? "❤️" : "🤍"} Save
              </button>

              <button
                style={{
                  background: "#fff",
                  color: "#2B2B2B",
                  border: "2px solid #F5C77A",
                  borderRadius: "12px",
                  padding: "0.875rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                🔗 Share
              </button>
            </div>
          </div>
        </div>

        {/* Gold Divider */}
        <hr className="gold-divider" style={{ marginBottom: "3rem" }} />

        {/* Tabbed Content */}
        <div style={{ marginBottom: "3rem" }}>
          {/* Tab Headers */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              borderBottom: "2px solid #F5C77A",
              marginBottom: "2rem",
            }}
          >
            {(["description", "metadata", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "1rem 0",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: activeTab === tab ? "#C41E3A" : "#6B7280",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #C41E3A"
                      : "3px solid transparent",
                  marginBottom: "-2px",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
              >
                {tab === "reviews" ? "Reviews 1,240" : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div
              style={{
                fontSize: "1rem",
                lineHeight: 1.8,
                color: "#2B2B2B",
              }}
            >
              <p style={{ marginBottom: "1rem" }}>
                {book.description ||
                  `The Tale of Kieu is an epic poem in Vietnamese written by Nguyen Du (1766-1820), and is widely regarded as the most significant work of Vietnamese literature. It tells of the life, trials and tribulations of Thuy Kieu, a beautiful and talented young woman, who had to sacrifice herself to save her family.`}
              </p>
              <p style={{ marginBottom: "1rem" }}>
                To save her father and younger brother from prison, she sells
                herself into marriage with a middle-aged man, not knowing that
                the man is actually a pimp, and is forced into prostitution.
                Throughout her journey, she endures her dignity and hope,
                embodying the Confucian values of filial piety and loyalty,
                while facing the cruel twists of fate.
              </p>
              <p>
                This edition features a new translation that captures the
                lyrical beauty of the original verses while making the story
                accessible to modern readers. It includes detailed footnotes
                explaining cultural references and historical context of the Le
                Dynasty.
              </p>

              {/* AI Extracted Data */}
              {(book.extracted_characters || book.extracted_settings) && (
                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.5rem",
                    background:
                      "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
                    borderRadius: "12px",
                    borderLeft: "4px solid #C41E3A",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#C41E3A",
                      marginBottom: "1rem",
                    }}
                  >
                    📚 AI-Extracted Details
                  </h4>
                  {book.extracted_characters && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#2B2B2B" }}>Characters:</strong>{" "}
                      <span style={{ color: "#6B7280" }}>
                        {book.extracted_characters}
                      </span>
                    </div>
                  )}
                  {book.extracted_settings && (
                    <div>
                      <strong style={{ color: "#2B2B2B" }}>Settings:</strong>{" "}
                      <span style={{ color: "#6B7280" }}>
                        {book.extracted_settings}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "metadata" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "1.5rem",
              }}
            >
              <MetadataItem label="Book ID" value={book.bookID.toString()} />
              <MetadataItem
                label="Published Year"
                value={book.published_year || "Unknown"}
              />
              <MetadataItem
                label="ISBN"
                value={book.clean_isbn || "Not available"}
              />
              <MetadataItem
                label="Category"
                value={book.google_category || "General"}
              />
              <MetadataItem
                label="Average Rating"
                value={book.average_rating.toString()}
              />
              <MetadataItem
                label="Preview Link"
                value={book.preview_link ? "Available" : "Not available"}
              />
            </div>
          )}

          {activeTab === "reviews" && (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
              <p style={{ fontSize: "1.1rem" }}>Reviews feature coming soon!</p>
              <p>
                Check back later to see what readers are saying about this book.
              </p>
            </div>
          )}
        </div>

        {/* Related Books Section */}
        {relatedBooks.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#2B2B2B",
                  margin: 0,
                }}
              >
                You might also like
              </h2>
              <span style={{ fontSize: "1.5rem" }}>💡</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "1.5rem",
                marginBottom: "3rem",
              }}
            >
              {relatedBooks.slice(0, 5).map((relatedBook) => (
                <div
                  key={relatedBook.bookID}
                  onClick={() => onSelectBook?.(relatedBook.bookID)}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(196,30,58,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(196,30,58,0.08)";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      paddingTop: "150%",
                      position: "relative",
                      background: "#f0f0f0",
                    }}
                  >
                    <img
                      src={
                        relatedBook.thumbnail ||
                        "https://via.placeholder.com/200x300?text=No+Cover"
                      }
                      alt={relatedBook.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#2B2B2B",
                        marginBottom: "0.25rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                      }}
                    >
                      {relatedBook.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#6B7280",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {relatedBook.authors}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span style={{ fontSize: "0.9rem" }}>⭐</span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#2B2B2B",
                          fontWeight: 600,
                        }}
                      >
                        {relatedBook.average_rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Decorative corner blossom */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            fontSize: "4rem",
            opacity: 0.1,
            pointerEvents: "none",
            transform: "rotate(15deg)",
          }}
        >
          🌸
        </div>
      </div>
    </div>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "1rem",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #F5C77A",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#6B7280",
          marginBottom: "0.25rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "0.95rem",
          color: "#2B2B2B",
          fontWeight: 500,
        }}
      >
        {value}
      </div>
    </div>
  );
}
