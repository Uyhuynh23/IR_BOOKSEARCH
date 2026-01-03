// web/src/utils/search.ts
import type { Book, SearchFilters } from '../types';

// Hàm gọi API Python với query và filters
export const searchBooks = async (query: string, filters?: SearchFilters): Promise<Book[]> => {
  // Allow search with empty query if filters are provided
  if (!query && (!filters || Object.keys(filters).length === 0)) {
    return [];
  }

  try {
    // Build URL with query parameters
    const params = new URLSearchParams();
    
    // Always add query parameter (empty string if not provided)
    params.append('q', query || '');
    
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
    
    // Gọi sang Server Python đang chạy ở port 5001
    const response = await fetch(`http://127.0.0.1:5001/search?${params.toString()}`);
    
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