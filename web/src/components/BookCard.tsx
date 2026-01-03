import { motion } from "framer-motion";
import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: (bookId: number) => void;
  onSelectBook?: (bookId: number) => void;
}

export default function BookCard({
  book,
  isFavorite,
  onToggleFavorite,
  onSelectBook,
}: BookCardProps) {
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

  const badge = getCategoryBadge(book.google_category);

  // Handle both bookID and book_id from backend
  const bookId = book.bookID || book.book_id || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelectBook?.(bookId)}
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
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(196,30,58,0.16)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(196,30,58,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Book Cover */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "150%",
          background: "linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)",
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
            onToggleFavorite(bookId);
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
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                  i < Math.floor(book.average_rating || 0)
                    ? "none"
                    : "grayscale(100%)",
                opacity: i < Math.floor(book.average_rating || 0) ? 1 : 0.3,
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
            ({(book.average_rating || 0).toFixed(1)})
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
            onSelectBook?.(bookId);
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
    </motion.div>
  );
}
