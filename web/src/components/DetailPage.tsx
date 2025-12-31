import type { Book } from '../types';
import { getPlaceholderImage } from '../utils/search';

interface DetailPageProps {
  book: Book | null;
  onBack: () => void;
}

export default function DetailPage({ book, onBack }: DetailPageProps) {
  if (!book) {
    return (
      <div className="page-shell">
        <div className="empty">❌ Book not found</div>
        <button className="ghost" onClick={onBack}>
          ← Back to Results
        </button>
      </div>
    );
  }

  const { core_metadata, identifiers, temporal, categorization, content, quality_signals, indexing, id } = book;
  const coverUrl = identifiers?.isbn_13
    ? `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_13}-L.jpg`
    : getPlaceholderImage();

  return (
    <div className="page-shell">
      <div className="gradient-bar" />
      <button className="ghost" onClick={onBack}>
        ← Back to Results
      </button>

      <div className="hero">
        <div className="hero-cover">
          <img src={coverUrl} alt={core_metadata.title} />
        </div>
        <div className="hero-meta">
          <h1>{core_metadata.title}</h1>
          {core_metadata.subtitle ? <p className="muted">{core_metadata.subtitle}</p> : null}
          <h3>by {core_metadata.author ?? 'Unknown Author'}</h3>
          {core_metadata.authors && core_metadata.authors.length > 1 ? (
            <p className="muted">Authors: {core_metadata.authors.join(', ')}</p>
          ) : null}

          <div className="meta-grid">
            <Meta label="Published" value={temporal?.publication_year ?? temporal?.publication_date ?? 'Unknown'} />
            <Meta
              label="ISBN"
              value={identifiers?.isbn_13 ?? identifiers?.isbn_10 ?? 'Not available'}
              isLink={!!identifiers?.isbn_13}
              href={identifiers?.isbn_13 ? `https://covers.openlibrary.org/b/isbn/${identifiers.isbn_13}-L.jpg` : undefined}
            />
            {core_metadata.publisher ? <Meta label="Publisher" value={core_metadata.publisher} /> : null}
            {core_metadata.format ? <Meta label="Format" value={core_metadata.format} /> : null}
            {core_metadata.page_count ? <Meta label="Pages" value={core_metadata.page_count} /> : null}
            <Meta label="Language" value={(core_metadata.language ?? 'en').toUpperCase()} />
            {quality_signals?.average_rating ? (
              <Meta
                label="Rating"
                value={`${quality_signals.average_rating.toFixed(2)} ${
                  quality_signals.ratings_count ? `(${quality_signals.ratings_count} ratings)` : ''
                }`}
              />
            ) : null}
            {quality_signals?.maturity_rating ? (
              <Meta label="Maturity" value={quality_signals.maturity_rating} />
            ) : null}
          </div>
        </div>
      </div>

      {content?.summary ? (
        <>
          <h3>📝 Enhanced Description</h3>
          <div className="summary">{content.summary}</div>
        </>
      ) : null}

      <div className="tabs">
        <div className="tab">
          <h4>📈 Metadata</h4>
          <ul>
            <li>Summary Length: {content?.summary_length ?? 0}</li>
            <li>Summary Words: {content?.summary_word_count ?? 0}</li>
            <li>Completeness Score: {indexing?.data_completeness_score?.toFixed(2) ?? '0.00'}</li>
            {temporal?.publication_date_enriched ? (
              <li>Enriched Pub Date: {temporal.publication_date_enriched}</li>
            ) : null}
          </ul>
        </div>

        <div className="tab">
          <h4>🔖 Identifiers</h4>
          <ul>
            <li>Wikipedia ID: {identifiers?.wikipedia_id ?? 'Not available'}</li>
            <li>Freebase ID: {identifiers?.freebase_id ?? 'Not available'}</li>
            <li>ISBN-13: {identifiers?.isbn_13 ?? 'N/A'}</li>
            <li>ISBN-10: {identifiers?.isbn_10 ?? 'N/A'}</li>
            <li>Book ID: {id}</li>
          </ul>
        </div>

        <div className="tab">
          <h4>🎨 Categorization</h4>
          <ul>
            <li>CMU Genres: {(categorization?.genres_cmu ?? []).join(', ') || 'None'}</li>
            <li>Normalized Genres: {(categorization?.genres_normalized ?? []).join(', ') || 'None'}</li>
            <li>Enriched Categories: {(categorization?.categories_enriched ?? []).join(', ') || 'None'}</li>
          </ul>
        </div>

        <div className="tab">
          <h4>⚙️ System Info</h4>
          <ul>
            <li>Indexed At: {indexing?.indexed_at?.replace('T', ' ').slice(0, 19) ?? 'N/A'}</li>
            <li>Last Updated: {indexing?.last_updated?.replace('T', ' ').slice(0, 19) ?? 'N/A'}</li>
            <li>Enrichment Status: {indexing?.enrichment_status ?? 'unknown'}</li>
            <li>Has ISBN: {indexing?.has_isbn ? 'Yes' : 'No'}</li>
            <li>Has Rating: {indexing?.has_rating ? 'Yes' : 'No'}</li>
            {coverUrl ? (
              <li>
                Cover URL: <a href={coverUrl}>Open</a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value, href, isLink }: { label: string; value: string | number; href?: string; isLink?: boolean }) {
  return (
    <div className="metadata-item">
      <strong>{label}:</strong>{' '}
      {isLink && href ? (
        <a href={href} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        value
      )}
    </div>
  );
}

