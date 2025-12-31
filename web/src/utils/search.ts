import type { Book, SearchFilters } from '../types';

export function getPlaceholderImage(): string {
  return 'https://via.placeholder.com/300x400/cccccc/666666?text=No+Cover';
}

export function formatGenres(genres: string[] = []): string {
  if (!genres.length) return '<span class="genre-tag">Uncategorized</span>';
  const tags = genres.slice(0, 3).map((genre) => `<span class="genre-tag">${genre}</span>`);
  return tags.join(' ');
}

function matchesFilters(book: Book, filters: SearchFilters): boolean {
  const { minRating, yearEnabled, yearMin, yearMax, language, genres } = filters;

  const avgRating = book.quality_signals?.average_rating;
  if (minRating > 0 && (avgRating === undefined || avgRating < minRating)) {
    return false;
  }

  const pubYear = book.temporal?.publication_year;
  if (yearEnabled && (pubYear === undefined || pubYear < yearMin || pubYear > yearMax)) {
    return false;
  }

  if (language !== 'All') {
    const bookLang = book.core_metadata.language ?? 'en';
    if (bookLang !== language) return false;
  }

  if (genres.length) {
    const bookGenres = book.categorization?.genres_normalized ?? [];
    const hasGenre = genres.some((g) => bookGenres.includes(g));
    if (!hasGenre) return false;
  }

  return true;
}

export function searchBooks(query: string, books: Book[], filters: SearchFilters): Book[] {
  if (!query?.trim()) return [];

  const queryLower = query.toLowerCase().trim();
  const keywords = queryLower.split(/\s+/);
  const scored: Array<{ score: number; book: Book }> = [];

  for (const book of books) {
    if (!matchesFilters(book, filters)) continue;

    let score = 0;
    const title = book.core_metadata.title?.toLowerCase() ?? '';
    const author = book.core_metadata.author?.toLowerCase() ?? '';
    const summary = book.content?.summary?.toLowerCase() ?? '';
    const genres = (book.categorization?.genres_cmu ?? []).map((g) => g.toLowerCase());

    for (const keyword of keywords) {
      if (keyword && title.includes(keyword)) score += 3;
      if (keyword && author.includes(keyword)) score += 2;
      if (keyword && genres.some((g) => g.includes(keyword))) score += 2;
      if (keyword && summary.includes(keyword)) score += 1;
    }

    if (score > 0) scored.push({ score, book });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(({ book }) => book);
}

