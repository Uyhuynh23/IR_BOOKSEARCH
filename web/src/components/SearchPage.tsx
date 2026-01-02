import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { SearchFilters } from "../types";
import SearchBar from "./SearchBar";

interface SearchPageProps {
  query: string;
  filters: SearchFilters;
  onChangeQuery: (value: string) => void;
  onUpdateFilters: (filters: Partial<SearchFilters>) => void;
  onSearch: (query: string) => void;
}

export default function SearchPage({
  query,
  filters,
  onChangeQuery,
  onUpdateFilters,
  onSearch,
}: SearchPageProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [petals, setPetals] = useState<
    Array<{ id: number; x: number; delay: number; duration: number }>
  >([]);
  const [currentQuote, setCurrentQuote] = useState<{
    text: string;
    author: string;
    x: number;
    y: number;
  } | null>(null);

  // Inspiring book quotes
  const bookQuotes = [
    {
      text: "A book is a dream that you hold in your hand.",
      author: "Neil Gaiman",
    },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    {
      text: "Reading is to the mind what exercise is to the body.",
      author: "Joseph Addison",
    },
    {
      text: "The more that you read, the more things you will know.",
      author: "Dr. Seuss",
    },
    {
      text: "A room without books is like a body without a soul.",
      author: "Cicero",
    },
    {
      text: "There is no friend as loyal as a book.",
      author: "Ernest Hemingway",
    },
    {
      text: "Reading gives us someplace to go when we have to stay where we are.",
      author: "Mason Cooley",
    },
    {
      text: "Books are mirrors: you only see in them what you already have inside you.",
      author: "Carlos Ruiz Zafón",
    },
    {
      text: "A book is a gift you can open again and again.",
      author: "Garrison Keillor",
    },
    { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
    {
      text: "Đọc sách là cách tốt nhất để mở rộng tâm hồn.",
      author: "Vietnamese Proverb",
    },
    {
      text: "Good books don't give up all their secrets at once.",
      author: "Stephen King",
    },
  ];

  // Generate floating petals on mount
  useEffect(() => {
    const petalArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
    }));
    setPetals(petalArray);
  }, []);

  const handleSubmit = () => {
    // Sparkle burst effect
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#C41E3A", "#F5C77A", "#FFE5E5", "#FFF5E5"],
      shapes: ["circle", "square"],
      gravity: 1.2,
      ticks: 200,
    });
    onSearch(query);
  };

  const handleQuickSearch = (quickQuery: string) => {
    onChangeQuery(quickQuery);
  };

  const handleClearFilters = () => {
    onUpdateFilters({
      genres: [],
      author: "",
      minRating: 0,
      yearMin: 1900,
      yearMax: new Date().getFullYear(),
      language: "All",
    });
  };

  const handleFlowerBurst = () => {
    // Select random quote with random position near decorative section
    const randomQuote =
      bookQuotes[Math.floor(Math.random() * bookQuotes.length)];

    // Random position around the decorative section (bottom center area)
    // X: 30-70% of viewport width (centered area)
    // Y: start around 70-85% of viewport height (near bottom)
    const randomX = Math.random() * 40;
    const randomY = Math.random() * 15;

    setCurrentQuote({
      ...randomQuote,
      x: randomX,
      y: randomY,
    });

    // Auto-hide quote after 8 seconds (longer for reading)
    setTimeout(() => setCurrentQuote(null), 4000);

    // Create multiple flower bursts
    const defaults = {
      origin: { y: 0.5 },
      colors: [
        "#FFB7C5",
        "#FFC0CB",
        "#FF69B4",
        "#FFE5E5",
        "#FFF5E5",
        "#C41E3A",
      ],
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
        shapes: ["circle"],
      });
    }

    // Burst effect with multiple waves
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const genreOptions = [
    "Fiction",
    "Non-fiction",
    "History",
    "Science",
    "Children",
    "Culture",
  ];
  const languageOptions = [
    "All",
    "Vietnamese",
    "English",
    "French",
    "Japanese",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFDF8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Peach Blossom Petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -100, x: `${petal.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: `${petal.x + Math.sin(petal.id) * 10}vw`,
            opacity: [0, 0.6, 0.6, 0],
            rotate: 360,
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "fixed",
            fontSize: "1.5rem",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          🌸
        </motion.div>
      ))}

      {/* Animated Background Pattern */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          background:
            "repeating-linear-gradient(45deg, #C41E3A 0px, #C41E3A 2px, transparent 2px, transparent 20px)",
          animation: "patternMove 60s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Top Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(196,30,58,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.75rem" }}>📚</span>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#2B2B2B",
                lineHeight: 1.2,
              }}
            >
              Book Search System
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#C41E3A",
                fontWeight: 500,
              }}
            >
              Explore Knowledge • Celebrate Culture
            </p>
          </div>
        </div>
      </motion.header>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Hero Search Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{
              fontSize: "3rem",
              fontWeight: 700,
              color: "#2B2B2B",
              marginBottom: "0.5rem",
              lineHeight: 1.2,
            }}
          >
            Discover Your{" "}
            <span style={{ color: "#C41E3A" }}>Next Great Read</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            style={{
              fontSize: "1.1rem",
              color: "#C41E3A",
              marginBottom: "2rem",
              fontWeight: 500,
            }}
          >
            Tìm sách hay – Khai xuân tri thức
          </motion.p>

          {/* Search Bar Component */}
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <SearchBar
              query={query}
              onChangeQuery={onChangeQuery}
              onSubmit={handleSubmit}
              autoFocus
              placeholder="Nhập tên sách, tác giả hoặc mô tả…"
            />
          </motion.div>

          {/* Trending Quick Suggestions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            style={{ marginBottom: "2rem" }}
          >
            <p
              style={{
                fontSize: "0.95rem",
                color: "#6B7280",
                marginBottom: "0.75rem",
                fontWeight: 600,
              }}
            >
              Trending:
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {[
                "Sách Tết",
                "Văn học Việt",
                "Tiểu thuyết",
                "Khoa học viễn tưởng",
              ].map((tag, index) => (
                <motion.button
                  key={tag}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.9 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickSearch(tag)}
                  style={{
                    background:
                      tag === "Sách Tết"
                        ? "linear-gradient(90deg, #C41E3A 60%, #F5C77A 100%)"
                        : "#fff",
                    color: tag === "Sách Tết" ? "#fff" : "#C41E3A",
                    border: tag === "Sách Tết" ? "none" : "1.5px solid #F5C77A",
                    borderRadius: "24px",
                    padding: "0.5rem 1.25rem",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      tag === "Sách Tết"
                        ? "0 2px 8px rgba(196,30,58,0.3)"
                        : "none",
                    animation:
                      tag === "Sách Tết"
                        ? "pulseGlow 2s ease-in-out infinite"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (tag !== "Sách Tết") {
                      e.currentTarget.style.background = "#C41E3A";
                      e.currentTarget.style.color = "#fff";
                    } else {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tag !== "Sách Tết") {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#C41E3A";
                    } else {
                      e.currentTarget.style.transform = "scale(1)";
                    }
                  }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Advanced Filter Panel (Collapsible) */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
            marginBottom: "3rem",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#FFFDF8")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#2B2B2B",
                }}
              >
                Advanced Search Filters
              </h3>
            </div>
            <span
              style={{
                fontSize: "1.25rem",
                transform: filtersExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              ⌄
            </span>
          </button>

          <AnimatePresence>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  padding: "0 1.5rem 1.5rem",
                  overflow: "hidden",
                }}
              >
                {/* Genres */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                      color: "#2B2B2B",
                      fontSize: "0.95rem",
                    }}
                  >
                    GENRES
                  </label>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {genreOptions.map((genre) => (
                      <motion.button
                        key={genre}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const newGenres = filters.genres.includes(genre)
                            ? filters.genres.filter((g) => g !== genre)
                            : [...filters.genres, genre];
                          onUpdateFilters({ genres: newGenres });
                        }}
                        style={{
                          background: filters.genres.includes(genre)
                            ? "#C41E3A"
                            : "#fff",
                          color: filters.genres.includes(genre)
                            ? "#fff"
                            : "#C41E3A",
                          border: "1.5px solid #C41E3A",
                          borderRadius: "20px",
                          padding: "0.4rem 1rem",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {genre}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Two-column layout for other filters */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {/* Author */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: "#2B2B2B",
                        fontSize: "0.95rem",
                      }}
                    >
                      Author
                    </label>
                    <input
                      type="text"
                      value={filters.author}
                      onChange={(e) =>
                        onUpdateFilters({ author: e.target.value })
                      }
                      placeholder="e.g. Nguyễn Nhật Ánh"
                      style={{
                        width: "100%",
                        margin: 0,
                      }}
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        color: "#2B2B2B",
                        fontSize: "0.95rem",
                      }}
                    >
                      Language
                    </label>
                    <select
                      value={filters.language}
                      onChange={(e) =>
                        onUpdateFilters({ language: e.target.value })
                      }
                      style={{
                        width: "100%",
                        margin: 0,
                        cursor: "pointer",
                      }}
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year Range */}
                <div style={{ marginTop: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                      color: "#2B2B2B",
                      fontSize: "0.95rem",
                    }}
                  >
                    Year Range
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          marginBottom: "0.25rem",
                        }}
                      >
                        From
                      </label>
                      <input
                        type="number"
                        min={1900}
                        max={new Date().getFullYear()}
                        value={filters.yearMin}
                        onChange={(e) =>
                          onUpdateFilters({ yearMin: Number(e.target.value) })
                        }
                        placeholder="1900"
                        style={{
                          width: "100%",
                          margin: 0,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#C41E3A",
                        marginTop: "1.5rem",
                      }}
                    >
                      –
                    </span>
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.85rem",
                          color: "#6B7280",
                          marginBottom: "0.25rem",
                        }}
                      >
                        To
                      </label>
                      <input
                        type="number"
                        min={1900}
                        max={new Date().getFullYear()}
                        value={filters.yearMax}
                        onChange={(e) =>
                          onUpdateFilters({ yearMax: Number(e.target.value) })
                        }
                        placeholder={String(new Date().getFullYear())}
                        style={{
                          width: "100%",
                          margin: 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div style={{ marginTop: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                      color: "#2B2B2B",
                      fontSize: "0.95rem",
                    }}
                  >
                    Minimum Rating
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9, rotate: -15 }}
                        onClick={() => onUpdateFilters({ minRating: star })}
                        style={{
                          background: "transparent",
                          border: "none",
                          fontSize: "1.5rem",
                          cursor: "pointer",
                          filter:
                            star <= filters.minRating
                              ? "none"
                              : "grayscale(100%)",
                          opacity: star <= filters.minRating ? 1 : 0.3,
                          transition: "all 0.2s",
                        }}
                      >
                        ⭐
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "1.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={handleClearFilters}
                    className="button-outline"
                    style={{ padding: "0.6rem 1.5rem" }}
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => onSearch(query)}
                    className="button-primary"
                    style={{ padding: "0.75rem 2rem" }}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Decorative Section */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.5,
            type: "spring",
            stiffness: 100,
          }}
          style={{ textAlign: "center", marginTop: "4rem" }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFlowerBurst}
            style={{
              width: "200px",
              height: "200px",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(196,30,58,0.12)",
              position: "relative",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
              }}
            >
              🌸
            </div>
            {/* Click Me Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 2.2,
                type: "spring",
                stiffness: 300,
              }}
              style={{
                position: "absolute",
                bottom: "-10px",
                right: "-10px",
                background: "linear-gradient(135deg, #C41E3A 0%, #F5C77A 100%)",
                color: "#fff",
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(196,30,58,0.3)",
                pointerEvents: "none",
                animation: "bounce 2s ease-in-out infinite",
              }}
            >
              Click me! 👆
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#2B2B2B",
              marginBottom: "0.5rem",
            }}
          >
            Happy Lunar New Year!
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            style={{
              fontSize: "1rem",
              color: "#6B7280",
              lineHeight: 1.6,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Start by typing in the search bar above to explore our
            <br />
            collection of festive reads, classics, and modern bestsellers.
          </motion.p>
        </motion.div>

        {/* Floating Quote Display */}
        <AnimatePresence>
          {currentQuote && (
            <motion.div
              initial={{
                opacity: 0,
                y: currentQuote.y,
                x: `${currentQuote.x}vw`,
                scale: 0.8,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: `${currentQuote.y - 30}vh`,
                x: `${currentQuote.x + Math.sin(currentQuote.x) * 3}vw`,
                scale: [0.8, 1, 1, 0.9],
              }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{
                duration: 8,
                ease: "easeOut",
                opacity: {
                  times: [0, 0.1, 0.9, 1],
                  duration: 8,
                },
              }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 100,
                pointerEvents: "none",
                maxWidth: "400px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,253,248,0.95) 0%, rgba(255,229,229,0.95) 100%)",
                  borderRadius: "20px",
                  padding: "1.5rem 2rem",
                  boxShadow:
                    "0 10px 40px rgba(196,30,58,0.2), 0 0 0 1px rgba(245,199,122,0.5)",
                  border: "2px solid #F5C77A",
                  backdropFilter: "blur(10px)",
                  textAlign: "center",
                }}
              >
                {/* Quote Icon */}
                <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
                  📖
                </div>

                {/* Quote Text */}
                <p
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#2B2B2B",
                    lineHeight: 1.5,
                    marginBottom: "0.75rem",
                    fontStyle: "italic",
                  }}
                >
                  "{currentQuote.text}"
                </p>

                {/* Author */}
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#C41E3A",
                    fontWeight: 700,
                    marginBottom: "0",
                  }}
                >
                  — {currentQuote.author}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 2px 8px rgba(196,30,58,0.3), 0 0 0 0 rgba(196,30,58,0.4);
          }
          50% {
            box-shadow: 0 4px 16px rgba(196,30,58,0.5), 0 0 20px 5px rgba(196,30,58,0.2);
          }
        }
        @keyframes patternMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100px 100px;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
}
