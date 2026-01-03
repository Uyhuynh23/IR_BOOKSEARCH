// web/src/types.ts

export interface Book {
  bookID: number;
  book_id?: number; // Backend alias
  title: string;
  authors: string;
  average_rating: number;
  rating?: number; // Backend alias
  clean_isbn: string;
  isbn?: string; // Backend alias
  description: string;
  published_year: string;
  year?: number; // Backend alias
  thumbnail: string;
  google_category: string;
  categories?: string; // Backend alias
  preview_link: string;
  publisher?: string;
  publication_date?: string;
  num_pages?: number;
  language?: string;
  score?: number; // Search relevance score
  extracted_characters?: string; // Dữ liệu AI trích xuất
  extracted_settings?: string;   // Dữ liệu AI trích xuất
}

export interface SearchFilters {
  genres: string[];
  author: string;
  minRating: number;
  yearMin: number;
  yearMax: number;
  language: string;
}