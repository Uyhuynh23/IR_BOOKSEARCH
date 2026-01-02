import { motion, AnimatePresence } from "framer-motion";
import type { Book } from "../../types";

interface StickyActionBarProps {
  show: boolean;
  book: Book;
  readingList: "none" | "want" | "reading" | "finished" | "favorite";
  onReadingListToggle: () => void;
  getReadingListIcon: () => string;
  getReadingListText: () => string;
}

export default function StickyActionBar({
  show,
  book,
  readingList,
  onReadingListToggle,
  getReadingListIcon,
  getReadingListText,
}: StickyActionBarProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 16px rgba(196,30,58,0.12)",
            padding: "1rem 2rem",
            zIndex: 1000,
            borderBottom: "2px solid #F5C77A",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={
                book.thumbnail ||
                "https://via.placeholder.com/60x90?text=No+Cover"
              }
              alt={book.title}
              style={{
                width: "40px",
                height: "60px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#2B2B2B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {book.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                {book.authors}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() =>
                  book.preview_link && window.open(book.preview_link, "_blank")
                }
                disabled={!book.preview_link}
                className="button-primary"
                style={{
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.9rem",
                  opacity: book.preview_link ? 1 : 0.5,
                  cursor: book.preview_link ? "pointer" : "not-allowed",
                }}
              >
                📖 Preview
              </button>
              <button
                onClick={onReadingListToggle}
                style={{
                  background: readingList !== "none" ? "#C41E3A" : "#fff",
                  color: readingList !== "none" ? "#fff" : "#C41E3A",
                  border: "2px solid #C41E3A",
                  borderRadius: "12px",
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {getReadingListIcon()} {getReadingListText()}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
