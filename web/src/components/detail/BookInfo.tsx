import { motion } from "framer-motion";
import type { Book } from "../../types";

interface BookInfoProps {
  book: Book;
  genres: string[];
  readingHours: number;
  remainingMinutes: number;
  estimatedPages: number;
  readingList: "none" | "want" | "reading" | "finished" | "favorite";
  onReadingListToggle: () => void;
  getReadingListIcon: () => string;
  getReadingListText: () => string;
}

export default function BookInfo({
  book,
  genres,
  readingHours,
  remainingMinutes,
  estimatedPages,
  readingList,
  onReadingListToggle,
  getReadingListIcon,
  getReadingListText,
}: BookInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
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
        style={{ fontSize: "1.25rem", color: "#C41E3A", marginBottom: "1rem" }}
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
        <span style={{ fontSize: "0.95rem", color: "#6B7280" }}>
          (1,240 reviews)
        </span>
      </div>

      {/* Social Proof Badges */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          style={{
            background: "linear-gradient(135deg, #C41E3A 0%, #A01528 100%)",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          🔥 Trending
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          style={{
            background: "linear-gradient(135deg, #F5C77A 0%, #E5B76A 100%)",
            color: "#2B2B2B",
            padding: "0.4rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          ⭐ Top Rated
        </motion.span>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          style={{
            background: "linear-gradient(135deg, #1F7A63 0%, #0D5A48 100%)",
            color: "#fff",
            padding: "0.4rem 1rem",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          📚 2.4k views
        </motion.span>
      </div>

      {/* Genre Badges */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {genres.slice(0, 3).map((genre, idx) => (
          <motion.span
            key={genre}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
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
          </motion.span>
        ))}
      </div>

      {/* Reading Time Estimate */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
          borderRadius: "12px",
          padding: "0.75rem 1rem",
          marginBottom: "2rem",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.9rem",
          color: "#2B2B2B",
          fontWeight: 600,
        }}
      >
        ⏱️ About {readingHours}h {remainingMinutes}m to read ({estimatedPages}{" "}
        pages)
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
        <MetadataField
          label="PUBLISHED"
          value={book.published_year || "Unknown"}
        />
        <MetadataField label="LANGUAGE" value="Vietnamese" />
        <MetadataField label="FORMAT" value="Hardcover, 324 pgs" />
        <MetadataField
          label="ISBN"
          value={book.clean_isbn || "Not available"}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            book.preview_link && window.open(book.preview_link, "_blank")
          }
          disabled={!book.preview_link}
          className="button-primary"
          style={{
            flex: 1,
            padding: "0.875rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            opacity: book.preview_link ? 1 : 0.5,
            cursor: book.preview_link ? "pointer" : "not-allowed",
          }}
        >
          📖 {book.preview_link ? "Read Preview" : "Preview Not Available"}
        </motion.button>

        <div style={{ position: "relative" }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReadingListToggle}
            style={{
              background: readingList !== "none" ? "#C41E3A" : "#fff",
              color: readingList !== "none" ? "#fff" : "#C41E3A",
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
            {getReadingListIcon()} {getReadingListText()}
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </div>
    </motion.div>
  );
}

function MetadataField({ label, value }: { label: string; value: string }) {
  return (
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
        {label}
      </div>
      <div style={{ fontSize: "0.95rem", color: "#2B2B2B", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
