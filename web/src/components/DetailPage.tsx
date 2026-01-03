import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { Book } from "../types";
import FloatingElements from "./detail/FloatingElements";
import StickyActionBar from "./detail/StickyActionBar";
import BookCover from "./detail/BookCover";
import BookInfo from "./detail/BookInfo";
import TabContent from "./detail/TabContent";
import RelatedBooks from "./detail/RelatedBooks";
import {
  fetchGoogleBookDetails,
  calculateReadingTime,
  type GoogleBookDetails,
} from "../utils/googleBooksApi";
import { fetchSmartRelatedBooks } from "../utils/relatedBooks";
import { fetchBookById } from "../utils/bookApi";

interface DetailPageProps {
  book: Book;
  relatedBooks?: Book[];
  onBack: () => void;
  onSelectBook?: (bookId: number) => void;
}

export default function DetailPage({
  book: initialBook,
  relatedBooks = [],
  onBack,
  onSelectBook,
}: DetailPageProps) {
  const [book, setBook] = useState(initialBook);
  const [activeTab, setActiveTab] = useState<
    "description" | "metadata" | "reviews"
  >("description");
  const [readingList, setReadingList] = useState<
    "none" | "want" | "reading" | "finished" | "favorite"
  >("none");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [floatingElements, setFloatingElements] = useState<
    Array<{
      id: number;
      type: string;
      x: number;
      delay: number;
      duration: number;
    }>
  >([]);
  const [googleData, setGoogleData] = useState<GoogleBookDetails | null>(null);
  const [loadingGoogleData, setLoadingGoogleData] = useState(true);
  const [smartRelatedBooks, setSmartRelatedBooks] = useState<Book[]>(relatedBooks);
  const [loadingRelatedBooks, setLoadingRelatedBooks] = useState(false);
  const googleDataCacheRef = useRef<Record<string, GoogleBookDetails | null>>({});
  const relatedBooksCache = useRef<Record<number, Book[]>>({});

  const genres = book.google_category
    ? book.google_category
        .split(/[,;]/)
        .map((g) => g.trim())
        .filter(Boolean)
    : [];

  const isClassic = book.published_year
    ? parseInt(book.published_year) < 1950
    : false;

  // Get page count and calculate reading time from Google Books data
  const estimatedPages = googleData?.pageCount || 0;
  const readingTime =
    estimatedPages > 0
      ? calculateReadingTime(estimatedPages)
      : { hours: 0, minutes: 0 };
  const readingHours = readingTime.hours;
  const remainingMinutes = readingTime.minutes;

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update book state when prop changes
  useEffect(() => {
    setBook(initialBook);
  }, [initialBook.bookID, initialBook.book_id]);

  // Scroll to top when book changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [book.bookID, book.book_id]);

  // Fetch full book data if this is a placeholder from a recommendation
  useEffect(() => {
    async function loadFullBookData() {
      // Check if this is a placeholder book (title is "Loading...")
      if (book.title !== "Loading...") {
        return; // Already have full data
      }

      const bookId = book.bookID || book.book_id;
      if (!bookId) return;

      console.log("📚 Fetching full book data for placeholder ID:", bookId);
      const fullBook = await fetchBookById(bookId);

      if (fullBook) {
        console.log("✅ Loaded full book data:", fullBook.title);
        // Update book state with full data
        setBook(fullBook);
      } else {
        console.warn("❌ Failed to load full book data");
      }
    }

    loadFullBookData();
  }, [book.bookID, book.book_id, book.title]);

  // Track scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate floating decorative elements
  useEffect(() => {
    const elements = [
      ...Array.from({ length: 6 }, (_, i) => ({
        id: i,
        type: "blossom",
        x: i < 3 ? 5 + Math.random() * 10 : 85 + Math.random() * 10,
        delay: Math.random() * 5,
        duration: 20 + Math.random() * 10,
      })),
      ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 6,
        type: "lixi",
        x: i === 0 ? 10 : i === 1 ? 50 : 90,
        delay: Math.random() * 8,
        duration: 25 + Math.random() * 15,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 9,
        type: "lantern",
        x: i === 0 ? 15 : 85,
        delay: Math.random() * 6,
        duration: 30 + Math.random() * 10,
      })),
    ];
    setFloatingElements(elements);
  }, []);

  // Fetch Google Books data for additional details (with caching and fallback to server data)
  useEffect(() => {
    async function loadGoogleData() {
      const cacheKey = `${book.clean_isbn}-${book.title}`;
      
      // Check if this is a placeholder book (no ISBN or empty title)
      if (!book.clean_isbn || book.title === "Loading...") {
        console.log("⚠️ Placeholder book detected, skipping Google data fetch until full data loads");
        setLoadingGoogleData(false);
        return;
      }
      
      // Check if data is already cached
      if (googleDataCacheRef.current[cacheKey] !== undefined) {
        setGoogleData(googleDataCacheRef.current[cacheKey]);
        setLoadingGoogleData(false);
        return;
      }
      
      setLoadingGoogleData(true);
      
      // First, check if book already has the necessary data from server
      const hasDataFromServer = book.num_pages || book.language;
      
      if (hasDataFromServer) {
        // Use data from server if available
        const serverData: GoogleBookDetails = {
          pageCount: book.num_pages || 0,
          language: book.language || "en",
          ratingsCount: undefined,
        };
        googleDataCacheRef.current[cacheKey] = serverData;
        setGoogleData(serverData);
        setLoadingGoogleData(false);
        return;
      }
      
      // If server data is missing, fetch from Google Books API with timeout
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 3000); // 3 second timeout
      });
      
      const data = await Promise.race([
        fetchGoogleBookDetails(book.clean_isbn, book.title),
        timeout
      ]);
      
      // Cache the result
      googleDataCacheRef.current[cacheKey] = data;
      setGoogleData(data);
      setLoadingGoogleData(false);
    }
    loadGoogleData();
  }, [book.clean_isbn, book.title, book.num_pages, book.language, book.description]);

  // Fetch smart related books from backend
  useEffect(() => {
    async function loadSmartRelatedBooks() {
      const bookId = book.bookID || book.book_id;
      if (!bookId) {
        console.log("❌ No book ID found");
        setSmartRelatedBooks(relatedBooks);
        return;
      }

      // Check if already cached
      if (relatedBooksCache.current[bookId]) {
        console.log("✅ Using cached related books:", relatedBooksCache.current[bookId].length);
        setSmartRelatedBooks(relatedBooksCache.current[bookId]);
        return;
      }

      // Show fallback immediately for fast UX
      console.log("⚡ Showing fallback books immediately:", relatedBooks.length);
      setSmartRelatedBooks(relatedBooks);
      setLoadingRelatedBooks(true);
      
      // Fetch smart recommendations in background with timeout
      try {
        const timeoutPromise = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 3000); // 3 second timeout
        });

        const related = await Promise.race([
          fetchSmartRelatedBooks(bookId, 5),
          timeoutPromise
        ]);

        if (related && related.length > 0) {
          console.log("📚 Smart recommendations received:", related.length, "books");
          relatedBooksCache.current[bookId] = related;
          setSmartRelatedBooks(related);
        } else {
          console.log("📚 Smart recommendations timed out or empty, using fallback");
          relatedBooksCache.current[bookId] = relatedBooks;
        }
      } catch (error) {
        console.warn("❌ Error fetching smart recommendations:", error);
        relatedBooksCache.current[bookId] = relatedBooks;
      } finally {
        setLoadingRelatedBooks(false);
      }
    }

    loadSmartRelatedBooks();
  }, [book.bookID, book.book_id, relatedBooks]); // Added relatedBooks back since we use it as initial

  const handleReadingListToggle = () => {
    const newValue = readingList === "favorite" ? "none" : "favorite";
    setReadingList(newValue);

    if (newValue !== "none") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C41E3A", "#F5C77A", "#1F7A63"],
      });
    }
  };

  const getReadingListIcon = () => {
    switch (readingList) {
      case "want":
        return "🎯";
      case "reading":
        return "📖";
      case "finished":
        return "✅";
      case "favorite":
        return "❤️";
      default:
        return "🤍";
    }
  };

  const getReadingListText = () => {
    switch (readingList) {
      case "want":
        return "Want to Read";
      case "reading":
        return "Reading";
      case "finished":
        return "Finished";
      case "favorite":
        return "Favorite";
      default:
        return "Add to List";
    }
  };

  const description =
    book.description ||
    `The Tale of Kieu is an epic poem in Vietnamese written by Nguyen Du (1766-1820), and is widely regarded as the most significant work of Vietnamese literature. It tells of the life, trials and tribulations of Thuy Kieu, a beautiful and talented young woman, who had to sacrifice herself to save her family. To save her father and younger brother from prison, she sells herself into marriage with a middle-aged man, not knowing that the man is actually a pimp, and is forced into prostitution. Throughout her journey, she endures her dignity and hope, embodying the Confucian values of filial piety and loyalty, while facing the cruel twists of fate.`;

  const shortDescription =
    description.split(" ").slice(0, 50).join(" ") + "...";
  const shouldShowReadMore = description.split(" ").length > 50;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFDF8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FloatingElements elements={floatingElements} windowWidth={windowWidth} />

      <StickyActionBar
        show={showStickyBar}
        book={book}
        readingList={readingList}
        onReadingListToggle={handleReadingListToggle}
        getReadingListIcon={getReadingListIcon}
        getReadingListText={getReadingListText}
      />

      {/* Top Navigation */}
      <header
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(196,30,58,0.08)",
          padding: "1rem 2rem",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "#C41E3A",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateX(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateX(0)")
            }
            title="Back to results"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to results
          </button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem" }}
      >
        {/* Main Book Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          <BookCover book={book} isClassic={isClassic} />
          <BookInfo
            book={book}
            genres={genres}
            readingHours={readingHours}
            remainingMinutes={remainingMinutes}
            estimatedPages={estimatedPages}
            readingList={readingList}
            onReadingListToggle={handleReadingListToggle}
            getReadingListIcon={getReadingListIcon}
            getReadingListText={getReadingListText}
            googleData={googleData}
            loadingGoogleData={loadingGoogleData}
          />
        </div>

        {/* Gold Divider */}
        <hr className="gold-divider" style={{ marginBottom: "3rem" }} />

        {/* Tabbed Content */}
        <div style={{ marginBottom: "3rem" }}>
          {/* Tab Headers */}
          <div
            style={{
              display: "flex",
              gap: "2rem",
              borderBottom: "2px solid #F5C77A",
              marginBottom: "2rem",
            }}
          >
            {(["description", "metadata", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "1rem 0",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: activeTab === tab ? "#C41E3A" : "#6B7280",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #C41E3A"
                      : "3px solid transparent",
                  marginBottom: "-2px",
                  textTransform: "capitalize",
                  transition: "all 0.2s",
                }}
              >
                {tab === "reviews" ? "Reviews 1,240" : tab}
              </button>
            ))}
          </div>

          <TabContent
            activeTab={activeTab}
            book={book}
            description={description}
            shortDescription={shortDescription}
            shouldShowReadMore={shouldShowReadMore}
            descriptionExpanded={descriptionExpanded}
            onToggleDescription={() =>
              setDescriptionExpanded(!descriptionExpanded)
            }
            googleData={googleData}
          />
        </div>

        <RelatedBooks 
          books={smartRelatedBooks} 
          onSelectBook={(bookId) => {
            console.log("📖 Clicking related book ID:", bookId);
            onSelectBook?.(bookId);
          }} 
          loading={loadingRelatedBooks} 
        />

        {/* Decorative corner blossom */}
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            fontSize: "4rem",
            opacity: 0.1,
            pointerEvents: "none",
            transform: "rotate(15deg)",
          }}
        >
          🌸
        </div>
      </motion.div>
    </div>
  );
}
