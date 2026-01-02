// Google Books API utility for fetching additional book details
// Free API - no key required for basic usage (1000 requests/day)

export interface GoogleBookDetails {
  pageCount?: number;
  ratingsCount?: number;
  language?: string;
  publisher?: string;
  publishedDate?: string;
  printType?: string;
  categories?: string[];
  maturityRating?: string;
  subtitle?: string;
}

/**
 * Fetch additional book details from Google Books API
 * @param isbn - Book ISBN (clean_isbn)
 * @param title - Book title (fallback if ISBN fails)
 * @returns GoogleBookDetails object or null if not found
 */
export async function fetchGoogleBookDetails(
  isbn: string,
  title?: string
): Promise<GoogleBookDetails | null> {
  try {
    // Try ISBN first
    let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    let response = await fetch(url);
    let data = await response.json();

    // Fallback to title search if ISBN doesn't work
    if (!data.items && title) {
      url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        title
      )}`;
      response = await fetch(url);
      data = await response.json();
    }

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const volumeInfo = data.items[0].volumeInfo;

    return {
      pageCount: volumeInfo.pageCount,
      ratingsCount: volumeInfo.ratingsCount,
      language: volumeInfo.language,
      publisher: volumeInfo.publisher,
      publishedDate: volumeInfo.publishedDate,
      printType: volumeInfo.printType || "BOOK",
      categories: volumeInfo.categories || [],
      maturityRating: volumeInfo.maturityRating,
      subtitle: volumeInfo.subtitle,
    };
  } catch (error) {
    console.error("Error fetching Google Books data:", error);
    return null;
  }
}

/**
 * Format print type for display
 */
export function formatPrintType(printType?: string): string {
  if (!printType) return "Book";
  return printType === "BOOK" ? "Book" : printType;
}

/**
 * Format language code to readable name
 */
export function formatLanguage(langCode?: string): string {
  const languages: Record<string, string> = {
    en: "English",
    vi: "Vietnamese",
    fr: "French",
    es: "Spanish",
    de: "German",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ru: "Russian",
    ar: "Arabic",
    pt: "Portuguese",
    it: "Italian",
  };

  return languages[langCode?.toLowerCase() || ""] || "Unknown";
}

/**
 * Calculate reading time estimate
 * @param pageCount - Number of pages
 * @param wordsPerPage - Average words per page (default 300)
 * @param readingSpeed - Words per minute (default 250)
 */
export function calculateReadingTime(
  pageCount: number,
  wordsPerPage: number = 300,
  readingSpeed: number = 250
): { hours: number; minutes: number } {
  const totalWords = pageCount * wordsPerPage;
  const totalMinutes = Math.ceil(totalWords / readingSpeed);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}
