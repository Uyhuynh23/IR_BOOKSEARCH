import { useState } from 'react';
import { searchBooks } from './utils/search';
import type { Book } from './types';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const results = await searchBooks(query);
    setBooks(results);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>📚 AI Intelligent Book Search</h1>
        <p style={{ color: '#7f8c8d' }}>Tìm kiếm sách theo ngữ nghĩa & nội dung (BM25 + FAISS + NLP)</p>
      </div>
      
      {/* SEARCH BAR */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', background: 'white' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập nội dung bạn nhớ... (VD: cậu bé phù thủy học phép thuật)"
          style={{ flex: 1, padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          style={{ 
            padding: '10px 25px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </button>
      </div>

      {/* KẾT QUẢ */}
      <div className="results-list">
        {!loading && searched && books.length === 0 && (
            <p style={{ textAlign: 'center', color: '#e74c3c' }}>Không tìm thấy cuốn sách nào phù hợp.</p>
        )}

        {books.map((book) => (
          <div key={book.bookID} style={{ 
            display: 'flex', 
            gap: '20px', 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            marginBottom: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            borderLeft: '5px solid #3498db'
          }}>
            {/* CỘT TRÁI: ẢNH BÌA */}
            <div style={{ flexShrink: 0 }}>
              <img 
                src={book.thumbnail || 'https://via.placeholder.com/128x190?text=No+Cover'} 
                alt={book.title} 
                style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
              />
              <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8em', color: '#888' }}>
                ID: {book.bookID}
              </div>
            </div>
            
            {/* CỘT PHẢI: THÔNG TIN */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '1.4em' }}>
                    {book.title}
                </h2>
                <span style={{ backgroundColor: '#f1c40f', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold' }}>
                    ⭐ {book.average_rating}
                </span>
              </div>

              <div style={{ color: '#555', fontSize: '0.95em', marginBottom: '10px' }}>
                ✍️ <b>{book.authors}</b> | 📅 {book.published_year} | 🏷️ {book.google_category || 'General'}
              </div>

              {/* PHẦN AI: CHARACTERS & SETTINGS */}
              {(book.extracted_characters || book.extracted_settings) && (
                  <div style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.9em' }}>
                      {book.extracted_characters && (
                          <div style={{ marginBottom: '5px' }}>
                              👤 <b>Nhân vật:</b> <span style={{ color: '#2980b9' }}>{book.extracted_characters}</span>
                          </div>
                      )}
                      {book.extracted_settings && (
                          <div>
                              📍 <b>Địa điểm:</b> <span style={{ color: '#27ae60' }}>{book.extracted_settings}</span>
                          </div>
                      )}
                  </div>
              )}
              
              <p style={{ fontSize: '0.95em', lineHeight: '1.5', color: '#444' }}>
                {book.description ? (
                    book.description.length > 250 ? book.description.substring(0, 250) + "..." : book.description
                ) : (
                    <em style={{color: '#999'}}>Không có mô tả chi tiết.</em>
                )}
              </p>

              {/* NÚT HÀNH ĐỘNG */}
              <div style={{ marginTop: '15px' }}>
                {book.preview_link && (
                    <a 
                      href={book.preview_link} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ 
                        textDecoration: 'none', 
                        backgroundColor: '#ff4757', 
                        color: 'white', 
                        padding: '8px 15px', 
                        borderRadius: '4px', 
                        fontSize: '0.9em',
                        display: 'inline-block'
                      }}
                    >
                      📖 Đọc thử (Google Books)
                    </a>
                )}
                <span style={{ marginLeft: '15px', fontSize: '0.85em', color: '#95a5a6' }}>
                    ISBN: {book.clean_isbn}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;