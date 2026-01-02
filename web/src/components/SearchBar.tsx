import { type FormEvent, useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  onChangeQuery: (value: string) => void;
  onSubmit: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  query,
  onChangeQuery,
  onSubmit,
  autoFocus = false,
  placeholder = "Search...",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={{
        boxShadow: isFocused
          ? "0 8px 24px rgba(196,30,58,0.2), 0 0 0 3px rgba(196,30,58,0.1)"
          : "0 4px 16px rgba(196,30,58,0.12)",
      }}
      transition={{ duration: 0.2 }}
      style={{
        display: "flex",
        alignItems: "stretch",
        maxWidth: "900px",
        margin: "0 auto 2rem",
        background: "#fff",
        borderRadius: "50px",
        boxShadow: "0 4px 16px rgba(196,30,58,0.12)",
        overflow: "hidden",
        height: "60px",
      }}
    >
      {/* Icon Wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "1.5rem",
          paddingRight: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "1.3rem",
            color: "#C41E3A",
            display: "block",
          }}
        >
          🔍
        </span>
      </div>

      {/* Input Wrapper */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          marginTop: "18px",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
            fontSize: "1rem",
            padding: "0 0.75rem",
            outline: "none",
            color: "#2B2B2B",
            height: "90%",
          }}
        />
      </div>

      {/* Button Wrapper */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.375rem",
        }}
      >
        <motion.button
          type="submit"
          className="button-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            height: "100%",
            padding: "0 2.5rem",
            borderRadius: "50px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          Search
        </motion.button>
      </div>
    </motion.form>
  );
}
