import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { SearchFilters } from "../../types";

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApply: () => void;
  onReset: () => void;
  appliedFilters?: SearchFilters;
  hasApplied?: boolean;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  appliedFilters,
  hasApplied,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [yearMinInput, setYearMinInput] = useState(String(filters.yearMin));
  const [yearMaxInput, setYearMaxInput] = useState(String(filters.yearMax));
  const [yearMinError, setYearMinError] = useState("");
  const [yearMaxError, setYearMaxError] = useState("");
  const [yearMinFocus, setYearMinFocus] = useState(false);
  const [yearMaxFocus, setYearMaxFocus] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleYearMinChange = (value: string) => {
    let year = parseInt(value);
    if (isNaN(year)) {
      setYearMinInput(value);
      setYearMinError("Invalid year");
      return;
    }
    
    // Auto-cap to current year
    if (year > currentYear) {
      year = currentYear;
    }
    
    setYearMinInput(String(year));
    
    // Check if from > to
    if (year > filters.yearMax) {
      setYearMinError(`Year cannot exceed ${filters.yearMax}`);
      return;
    }
    
    setYearMinError("");
    onFiltersChange({ ...filters, yearMin: year });
  };

  const handleYearMaxChange = (value: string) => {
    let year = parseInt(value);
    if (isNaN(year)) {
      setYearMaxInput(value);
      setYearMaxError("Invalid year");
      return;
    }
    
    // Auto-cap to current year
    if (year > currentYear) {
      year = currentYear;
    }
    
    setYearMaxInput(String(year));
    
    // Check if to < from
    if (year < filters.yearMin) {
      setYearMaxError(`Year cannot be less than ${filters.yearMin}`);
      return;
    }
    
    setYearMaxError("");
    onFiltersChange({ ...filters, yearMax: year });
  };

  const handleYearMinBlur = () => {
    setYearMinFocus(false);
    if (yearMinError || yearMinInput === "" || yearMinInput === "0") {
      setYearMinInput(String(filters.yearMin));
    }
  };

  const handleYearMaxBlur = () => {
    setYearMaxFocus(false);
    if (yearMaxError || yearMaxInput === "" || yearMaxInput === "0") {
      setYearMaxInput(String(filters.yearMax));
    }
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, minRating: rating });
  };

  const handleAuthorChange = (value: string) => {
    onFiltersChange({ ...filters, author: value });
  };

  const handleLanguageChange = (value: string) => {
    onFiltersChange({ ...filters, language: value });
  };

  const filtersToCheck = appliedFilters || filters;
  const hasActiveFilters = hasApplied !== undefined 
    ? hasApplied
    : (filtersToCheck.minRating > 0 ||
      (filtersToCheck.author !== "" && filtersToCheck.author !== null) ||
      (filtersToCheck.language !== "" && filtersToCheck.language !== "All") ||
      filtersToCheck.yearMin !== 1800 ||
      filtersToCheck.yearMax !== currentYear);

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: hasActiveFilters
            ? "linear-gradient(135deg, #C41E3A 0%, #8B1529 100%)"
            : "#fff",
          color: hasActiveFilters ? "#fff" : "#C41E3A",
          border: `2px solid #C41E3A`,
          borderRadius: "12px",
          padding: "0.75rem 1.5rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: "100%",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(196,30,58,0.1)",
          transition: "all 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🎛️</span>
          <span>Advanced Filters</span>
          {hasActiveFilters && (
            <span
              style={{
                background: "rgba(255,255,255,0.3)",
                padding: "0.2rem 0.6rem",
                borderRadius: "12px",
                fontSize: "0.8rem",
              }}
            >
              Active
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: "1.2rem" }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                marginTop: "1rem",
                boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
                border: "1px solid #F5C77A",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {/* Rating Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#2B2B2B",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Minimum Rating
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[0, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleRatingChange(rating)}
                        style={{
                          flex: 1,
                          background:
                            filters.minRating === rating ? "#C41E3A" : "#fff",
                          color:
                            filters.minRating === rating ? "#fff" : "#2B2B2B",
                          border: `2px solid ${
                            filters.minRating === rating ? "#C41E3A" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          padding: "0.6rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {rating === 0 ? "Any" : `${rating}+`}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Year Range Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#2B2B2B",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Publication Year
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        value={yearMinInput}
                        onChange={(e) => handleYearMinChange(e.target.value)}
                        onFocus={() => setYearMinFocus(true)}
                        onBlur={handleYearMinBlur}
                        placeholder="From"
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          border: `2px solid ${
                            yearMinError ? "#EF4444" : yearMinFocus ? "#C41E3A" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.2s",
                          background: yearMinError ? "#FEE2E2" : "#fff",
                          boxSizing: "border-box",
                        }}
                      />
                      {yearMinError && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#DC2626",
                            marginTop: "0.3rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                         {yearMinError}
                        </div>
                      )}
                    </div>
                    <span style={{ color: "#6B7280", fontWeight: 600, paddingTop: "0.6rem" }}>→</span>
                    <div style={{ flex: 1 }}>
                      <input
                        type="number"
                        value={yearMaxInput}
                        onChange={(e) => handleYearMaxChange(e.target.value)}
                        onFocus={() => setYearMaxFocus(true)}
                        onBlur={handleYearMaxBlur}
                        placeholder="To"
                        style={{
                          width: "100%",
                          padding: "0.6rem",
                          border: `2px solid ${
                            yearMaxError ? "#EF4444" : yearMaxFocus ? "#C41E3A" : "#E5E7EB"
                          }`,
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          outline: "none",
                          transition: "border-color 0.2s",
                          background: yearMaxError ? "#FEE2E2" : "#fff",
                          boxSizing: "border-box",
                        }}
                      />
                      {yearMaxError && (
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#DC2626",
                            marginTop: "0.3rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          {yearMaxError}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#6B7280",
                      marginTop: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    Range: {filters.yearMin} – {filters.yearMax}
                  </div>
                </div>

                {/* Author Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#2B2B2B",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={filters.author}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                    placeholder="e.g., J.K. Rowling"
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#C41E3A")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                  />
                  {filters.author && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        marginTop: "0.4rem",
                      }}
                    >
                      Searching for: <strong>{filters.author}</strong>
                    </div>
                  )}
                </div>

                {/* Language Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#2B2B2B",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none",
                      cursor: "pointer",
                      background: "#fff",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#C41E3A")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
                  >
                    <option value="All">All Languages</option>
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="ja">Japanese</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1.5rem",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onReset();
                    setYearMinInput(String(filters.yearMin));
                    setYearMaxInput(String(filters.yearMax));
                    setYearMinError("");
                    setYearMaxError("");
                  }}
                  style={{
                    background: "transparent",
                    color: "#6B7280",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    padding: "0.6rem 1.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onApply}
                  className="button-primary"
                  style={{
                    padding: "0.6rem 2rem",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                  }}
                >
                  Apply Filters
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
