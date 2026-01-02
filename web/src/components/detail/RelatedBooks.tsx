import type { Book } from "../../types";

interface RelatedBooksProps {
  books: Book[];
  onSelectBook?: (bookId: number) => void;
}

export default function RelatedBooks({
  books,
  onSelectBook,
}: RelatedBooksProps) {
  if (books.length === 0) return null;

  return (
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
        {books.slice(0, 5).map((relatedBook) => (
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
  );
}
