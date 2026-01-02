import { motion } from "framer-motion";

interface ActiveFiltersProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedCategories,
  onToggleCategory,
  onClearAll,
}: ActiveFiltersProps) {
  if (selectedCategories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(135deg, #FFF5E5 0%, #FFE5E5 100%)",
        borderRadius: "12px",
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#2B2B2B" }}>
        Bộ lọc đang áp dụng:
      </span>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          flex: 1,
        }}
      >
        {selectedCategories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleCategory(cat)}
            style={{
              background: "#C41E3A",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {cat}
            <span style={{ fontSize: "1.1rem" }}>×</span>
          </motion.button>
        ))}
      </div>
      <button
        onClick={onClearAll}
        style={{
          background: "transparent",
          color: "#C41E3A",
          border: "1.5px solid #C41E3A",
          borderRadius: "20px",
          padding: "0.4rem 1rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Xóa tất cả
      </button>
    </motion.div>
  );
}
