import { motion } from "framer-motion";
import type { Book } from "../../types";

interface BookCoverProps {
  book: Book;
  isClassic: boolean;
}

export default function BookCover({ book, isClassic }: BookCoverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ position: "relative" }}
    >
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
    </motion.div>
  );
}
