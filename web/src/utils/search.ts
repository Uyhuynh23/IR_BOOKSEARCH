// web/src/utils/search.ts
import type { Book, SearchFilters } from '../types';

// Hàm gọi API Python với query và filters
export const searchBooks = async (query: string, filters?: SearchFilters): Promise<Book[]> => {
  if (!query) return [];

  try {
    // Build URL with query parameters
    const params = new URLSearchParams();
    params.append('q', query);
    
    // Add filters if provided
    if (filters) {
      if (filters.genres && filters.genres.length > 0) {
        params.append('genres', filters.genres.join(','));
      }
      if (filters.author) {
        params.append('author', filters.author);
      }
      if (filters.yearMin) {
        params.append('yearMin', String(filters.yearMin));
      }
      if (filters.yearMax) {
        params.append('yearMax', String(filters.yearMax));
      }
      if (filters.minRating && filters.minRating > 0) {
        params.append('minRating', String(filters.minRating));
      }
      if (filters.language && filters.language !== 'All') {
        params.append('language', filters.language);
      }
    }
    
    // Gọi sang Server Python đang chạy ở port 5000
    const response = await fetch(`http://127.0.0.1:5000/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Lỗi kết nối tới Server!');
    }

    const data = await response.json();
    return data; 
    
  } catch (error) {
    console.error("Search API Error:", error);
    return [];
  }
};