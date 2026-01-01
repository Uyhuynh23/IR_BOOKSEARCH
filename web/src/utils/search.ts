// web/src/utils/search.ts
import type { Book } from '../types';

// Hàm gọi API Python, chỉ cần nhận vào 'query'
export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query) return [];

  try {
    // Gọi sang Server Python đang chạy ở port 5000
    const response = await fetch(`http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`);
    
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