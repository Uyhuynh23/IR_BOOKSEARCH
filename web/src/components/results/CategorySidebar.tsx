import { motion } from "framer-motion";

interface CategorySidebarProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  windowWidth: number;
}

export default function CategorySidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  windowWidth,
}: CategorySidebarProps) {
  if (windowWidth < 1200 || categories.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        width: "220px",
        flexShrink: 0,
        position: "sticky",
        top: "6rem",
        height: "fit-content",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "1.5rem",
          boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🏷️</span>
          <h3
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#2B2B2B",
            }}
          >
            Thể loại
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleCategory(category)}
              style={{
                background: selectedCategories.includes(category)
                  ? "#C41E3A"
                  : "#fff",
                color: selectedCategories.includes(category)
                  ? "#fff"
                  : "#2B2B2B",
                border: `1.5px solid ${
                  selectedCategories.includes(category) ? "#C41E3A" : "#F5C77A"
                }`,
                borderRadius: "8px",
                padding: "0.6rem 1rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
