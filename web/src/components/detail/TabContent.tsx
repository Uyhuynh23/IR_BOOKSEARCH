import { motion } from "framer-motion";
import type { Book } from "../../types";
import type { GoogleBookDetails } from "../../utils/googleBooksApi";
import { formatLanguage } from "../../utils/googleBooksApi";

interface TabContentProps {
  activeTab: "description" | "metadata" | "reviews";
  book: Book;
  description: string;
  shortDescription: string;
  shouldShowReadMore: boolean;
  descriptionExpanded: boolean;
  onToggleDescription: () => void;
  googleData: GoogleBookDetails | null;
}

export default function TabContent({
  activeTab,
  book,
  description,
  shortDescription,
  shouldShowReadMore,
  descriptionExpanded,
  onToggleDescription,
  googleData,
}: TabContentProps) {
  if (activeTab === "description") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: "1rem", lineHeight: 1.8, color: "#2B2B2B" }}
      >
        <div
          style={{
            maxHeight: descriptionExpanded ? "none" : "200px",
            overflow: "hidden",
            position: "relative",
            transition: "max-height 0.3s ease",
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            {descriptionExpanded
              ? description
              : shouldShowReadMore
              ? shortDescription
              : description}
          </p>
          {!descriptionExpanded && shouldShowReadMore && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: "linear-gradient(to bottom, transparent, #FFFDF8)",
              }}
            />
          )}
        </div>
        {shouldShowReadMore && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleDescription}
            style={{
              background: "transparent",
              border: "none",
              color: "#C41E3A",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {descriptionExpanded ? "Rút gọn" : "Đọc thêm"}
            <span style={{ fontSize: "1.2rem" }}>
              {descriptionExpanded ? "▲" : "▼"}
            </span>
          </motion.button>
        )}

        {/* AI Extracted Data */}
        {(book.extracted_characters || book.extracted_settings) && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
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
      </motion.div>
    );
  }

  if (activeTab === "metadata") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          <MetadataItem label="Book ID" value={book.bookID.toString()} />
          <MetadataItem label="Title" value={book.title} />
          <MetadataItem label="Author(s)" value={book.authors} />
          <MetadataItem
            label="Publisher"
            value={googleData?.publisher || "Unknown"}
          />
          <MetadataItem
            label="Published Date"
            value={
              googleData?.publishedDate || book.published_year || "Unknown"
            }
          />
          <MetadataItem
            label="Language"
            value={formatLanguage(googleData?.language)}
          />
          <MetadataItem
            label="Pages"
            value={
              googleData?.pageCount
                ? googleData.pageCount.toString()
                : "Unknown"
            }
          />
          <MetadataItem
            label="Format"
            value={googleData?.printType || "Unknown"}
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
            value={`${book.average_rating} / 5.0`}
          />
          <MetadataItem
            label="Ratings Count"
            value={googleData?.ratingsCount?.toLocaleString() || "No ratings"}
          />
        </div>

        {/* Additional Categories from Google Books */}
        {googleData?.categories && googleData.categories.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h4
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#2B2B2B",
                marginBottom: "1rem",
              }}
            >
              📚 Subject Categories
            </h4>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {googleData.categories.map((category, idx) => (
                <span
                  key={idx}
                  style={{
                    background: "#FFE5E5",
                    color: "#C41E3A",
                    padding: "0.4rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Reviews tab
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ textAlign: "center", padding: "3rem 2rem" }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#2B2B2B",
          marginBottom: "0.5rem",
        }}
      >
        Reviews Coming Soon
      </h3>
      <p style={{ fontSize: "1rem", color: "#6B7280", lineHeight: 1.6 }}>
        User reviews and ratings will be available once our review system is
        launched. Check back soon to see what readers are saying about this
        book!
      </p>
    </motion.div>
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
      <div style={{ fontSize: "0.95rem", color: "#2B2B2B", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
