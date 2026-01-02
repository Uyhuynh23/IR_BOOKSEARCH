import { motion } from "framer-motion";
import type { Book } from "../../types";
import type { GoogleBookDetails } from "../../utils/googleBooksApi";
import { formatLanguage } from "../../utils/googleBooksApi";

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
  googleData: GoogleBookDetails | null;
  loadingGoogleData: boolean;
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
  googleData,
  loadingGoogleData,
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
          {googleData?.ratingsCount
            ? `(${googleData.ratingsCount.toLocaleString()} reviews)`
            : "(No reviews yet)"}
        </span>
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
      {estimatedPages > 0 && (
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
      )}

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
          value={googleData?.publishedDate || book.published_year || "Unknown"}
          loading={loadingGoogleData}
        />
        <MetadataField
          label="LANGUAGE"
          value={formatLanguage(googleData?.language)}
          loading={loadingGoogleData}
        />
        <MetadataField
          label="FORMAT"
          value={
            estimatedPages > 0
              ? `${googleData?.printType || "Book"}, ${estimatedPages} pgs`
              : googleData?.printType || "Book"
          }
          loading={loadingGoogleData}
        />
        <MetadataField
          label="PUBLISHER"
          value={googleData?.publisher || "Unknown"}
          loading={loadingGoogleData}
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

function MetadataField({
  label,
  value,
  loading = false,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
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
        {loading ? <span style={{ opacity: 0.5 }}>Loading...</span> : value}
      </div>
    </div>
  );
}
