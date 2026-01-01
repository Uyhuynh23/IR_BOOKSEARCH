// web/src/types.ts

export interface Book {
  bookID: number;
  title: string;
  authors: string;
  average_rating: number;
  clean_isbn: string;
  description: string;
  published_year: string;
  thumbnail: string;
  google_category: string;
  preview_link: string;
  extracted_characters: string; // Dữ liệu AI trích xuất
  extracted_settings: string;   // Dữ liệu AI trích xuất
}