import type { Book } from "../types";

const API_BASE_URL = "http://127.0.0.1:5001";

/**
 * Fetch semantically similar books from the backend using vector embeddings
 * @param bookId - The book ID to find recommendations for
 * @param limit - Maximum number of recommendations to return
 * @returns Promise<Book[]> - Array of related books
 */
export async function fetchSmartRelatedBooks(
  bookId: number,
  limit: number = 5
): Promise<Book[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        liked_ids: [bookId],
        limit,
      }),
    });

    if (!response.ok) {
      console.warn(
        `Failed to fetch related books: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Error fetching smart related books:", error);
    return [];
  }
}
