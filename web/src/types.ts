export type Genre = string;

export interface Book {
  id: string;
  core_metadata: {
    title: string;
    subtitle?: string;
    author?: string;
    authors?: string[];
    publisher?: string;
    language?: string;
    page_count?: number;
    format?: string;
  };
  temporal?: {
    publication_year?: number;
    publication_date?: string;
    publication_date_enriched?: string;
  };
  categorization?: {
    genres_cmu?: Genre[];
    genres_normalized?: Genre[];
    categories_enriched?: string[];
  };
  content?: {
    summary?: string;
    summary_length?: number;
    summary_word_count?: number;
  };
  identifiers?: {
    wikipedia_id?: string;
    freebase_id?: string;
    isbn_13?: string;
    isbn_10?: string;
  };
  quality_signals?: {
    average_rating?: number;
    ratings_count?: number;
    maturity_rating?: string;
  };
  indexing?: {
    indexed_at?: string;
    last_updated?: string;
    enrichment_status?: string;
    has_isbn?: boolean;
    has_rating?: boolean;
    data_completeness_score?: number;
  };
}

export interface SearchFilters {
  genres: Genre[];
  language: string;
  minRating: number;
  yearEnabled: boolean;
  yearMin: number;
  yearMax: number;
}

