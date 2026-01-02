import { motion } from "framer-motion";
import type { Book } from "../../types";

interface TabContentProps {
  activeTab: "description" | "metadata" | "reviews";
  book: Book;
  description: string;
  shortDescription: string;
  shouldShowReadMore: boolean;
  descriptionExpanded: boolean;
  onToggleDescription: () => void;
  reviewDistribution: Array<{
    stars: number;
    percentage: number;
    count: number;
  }>;
}

export default function TabContent({
  activeTab,
  book,
  description,
  shortDescription,
  shouldShowReadMore,
  descriptionExpanded,
  onToggleDescription,
  reviewDistribution,
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Review Statistics */}
      <div style={{ marginBottom: "3rem" }}>
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#2B2B2B",
            marginBottom: "1.5rem",
          }}
        >
          📊 Rating Distribution
        </h3>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {reviewDistribution.map((dist) => (
            <div
              key={dist.stars}
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <div
                style={{
                  width: "80px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#2B2B2B",
                  }}
                >
                  {dist.stars}
                </span>
                <span style={{ fontSize: "1rem" }}>⭐</span>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#F5F5F5",
                  borderRadius: "8px",
                  height: "24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dist.percentage}%` }}
                  transition={{ duration: 1, delay: dist.stars * 0.1 }}
                  style={{
                    height: "100%",
                    background:
                      dist.stars >= 4
                        ? "linear-gradient(90deg, #C41E3A 0%, #F5C77A 100%)"
                        : dist.stars === 3
                        ? "#F5C77A"
                        : "#E5E7EB",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div
                style={{
                  width: "60px",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#6B7280",
                  textAlign: "right",
                }}
              >
                {dist.percentage}%
              </div>
              <div
                style={{
                  width: "80px",
                  fontSize: "0.85rem",
                  color: "#9CA3AF",
                  textAlign: "right",
                }}
              >
                ({dist.count})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Message */}
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          background: "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
          borderRadius: "16px",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#2B2B2B",
            marginBottom: "0.5rem",
          }}
        >
          Detailed reviews coming soon!
        </p>
        <p style={{ color: "#6B7280" }}>
          Check back later to read what other readers are saying about this
          book.
        </p>
      </div>
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
