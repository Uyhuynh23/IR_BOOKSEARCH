import type { Book } from "../types";

const API_BASE_URL = "http://127.0.0.1:5001";

/**
 * Fetch a single book by ID from the backend
 * Merges data and normalizes field names to ensure all fields are present
 * @param bookId - The book ID to fetch
 * @returns Promise<Book | null> - The book data or null if not found
 */
export async function fetchBookById(bookId: number): Promise<Book | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/book/${bookId}`);

    if (!response.ok) {
      console.warn(
        `Failed to fetch book: ${response.status} ${response.statusText}`
      );
      return null;
    }

    let data = await response.json();
    
    // Normalize field names - handle both bookID and book_id
    if (!data.bookID && data.book_id) {
      data.bookID = data.book_id;
    }
    
    // Ensure categories field exists (might be google_category from some sources)
    if (!data.categories && data.google_category) {
      data.categories = data.google_category;
    }
    if (!data.google_category && data.categories) {
      data.google_category = data.categories;
    }
    
    // Ensure all required text fields exist
    if (!data.title) data.title = "Unknown";
    if (!data.authors) data.authors = [];
    if (!data.description) data.description = "";
    if (!data.thumbnail) data.thumbnail = "";
    if (!data.language) data.language = "English";
    if (!data.publisher) data.publisher = "Unknown";
    
    console.log(
      `📚 Fetched complete book data for ID ${bookId}: ${data.title}`,
      { fields: Object.keys(data).length }
    );
    
    return data as Book;
  } catch (error) {
    console.warn("Error fetching book:", error);
    return null;
  }
}
