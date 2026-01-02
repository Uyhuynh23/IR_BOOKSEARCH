from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import faiss
import pickle
import string
import os

from sentence_transformers import SentenceTransformer, CrossEncoder

app = Flask(__name__)
CORS(app) # Cho phép Frontend (React) gọi API này

# --- LOAD RESOURCES (Chạy 1 lần khi server start) ---
print("⏳ Loading indexes...")
try:
    # 1. Load Data & Index
    df = pd.read_pickle("books_metadata.pkl")
    df = df.fillna("") # Fix lỗi NaN khi chuyển sang JSON
    
    with open("bm25_index.pkl", "rb") as f:
        bm25 = pickle.load(f)
    
    index = faiss.read_index("faiss_index.bin")
    
    # Lấy đường dẫn hiện tại của file app.py
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # 2. Load Bi-Encoder (OFFLINE)
    # Sửa lại để trỏ vào thư mục models/bi-encoder
    bi_model_path = os.path.join(current_dir, 'models', 'bi-encoder')
    print(f"Loading Bi-Encoder from: {bi_model_path}")
    
    # Kiểm tra xem thư mục có tồn tại không trước khi load
    if os.path.exists(bi_model_path):
        bi_encoder = SentenceTransformer(bi_model_path)
    else:
        print("⚠️ Không tìm thấy folder offline, đang thử tải online...")
        bi_encoder = SentenceTransformer('all-MiniLM-L6-v2')

    # 3. Load Cross-Encoder (OFFLINE)
    cross_model_path = os.path.join(current_dir, 'models', 'cross-encoder')
    print(f"Loading Cross-Encoder from: {cross_model_path}")
    cross_encoder = CrossEncoder(cross_model_path)
    
    print("✅ System Ready!")

except Exception as e:
    print(f"❌ Error loading files: {e}")
    # Có thể exit luôn nếu lỗi model quan trọng
    # exit(1) 

# --- SEARCH LOGIC ---
def search_engine(query, top_k=20, filters=None):
    """
    Search engine with filter support
    Args:
        query: search query string
        top_k: number of initial candidates
        filters: dict with genres, author, minRating, yearMin, yearMax, language
    """
    print(f"🔍 Search query: {query}")
    print(f"🔍 Filters: {filters}")
    
    # 1. BM25 (Keyword)
    tokenized_query = query.lower().translate(str.maketrans('', '', string.punctuation)).split()
    bm25_scores = bm25.get_scores(tokenized_query)
    bm25_top_n = np.argsort(bm25_scores)[::-1][:top_k]
    
    # 2. FAISS (Semantic)
    query_vector = bi_encoder.encode([query])
    faiss.normalize_L2(query_vector)
    _, faiss_top_n = index.search(query_vector, top_k)
    faiss_top_n = faiss_top_n[0]
    
    # 3. Fusion (Gộp kết quả)
    candidate_indices = list(set(bm25_top_n) | set(faiss_top_n))
    print(f"📊 Initial candidates: {len(candidate_indices)}")
    
    # 4. Apply Filters BEFORE Reranking (if provided) - Progressive filtering
    if filters:
        last_valid_indices = candidate_indices.copy()  # Keep track of last valid result
        
        # Filter 1: Genres
        if filters.get('genres') and len(filters['genres']) > 0:
            filtered_indices = []
            for idx in candidate_indices:
                book = df.iloc[idx]
                book_genres = str(book.get('google_category', '')).lower()
                # Include books with empty categories, or matching categories
                if not book_genres or book_genres == 'nan' or any(genre.lower() in book_genres for genre in filters['genres']):
                    filtered_indices.append(idx)
            
            if filtered_indices:  # Only apply if we still have results
                candidate_indices = filtered_indices
                last_valid_indices = candidate_indices.copy()
                print(f"📊 After genre filter: {len(candidate_indices)} results")
            else:
                print(f"⚠️ Genre filter would return 0 results, keeping {len(last_valid_indices)} previous results")
        
        # Filter 2: Author
        if filters.get('author'):
            filtered_indices = []
            for idx in candidate_indices:
                book = df.iloc[idx]
                book_author = str(book.get('authors', '')).lower()
                if filters['author'].lower() in book_author:
                    filtered_indices.append(idx)
            
            if filtered_indices:
                candidate_indices = filtered_indices
                last_valid_indices = candidate_indices.copy()
                print(f"📊 After author filter: {len(candidate_indices)} results")
            else:
                print(f"⚠️ Author filter would return 0 results, keeping {len(last_valid_indices)} previous results")
        
        # Filter 3: Year Range
        if filters.get('yearMin') or filters.get('yearMax'):
            filtered_indices = []
            for idx in candidate_indices:
                book = df.iloc[idx]
                book_year = book.get('publishedDate', '')
                try:
                    year = int(str(book_year)[:4]) if book_year else 0
                    if filters.get('yearMin') and year < filters['yearMin']:
                        continue
                    if filters.get('yearMax') and year > filters['yearMax']:
                        continue
                    filtered_indices.append(idx)
                except:
                    pass
            
            if filtered_indices:
                candidate_indices = filtered_indices
                last_valid_indices = candidate_indices.copy()
                print(f"📊 After year filter: {len(candidate_indices)} results")
            else:
                print(f"⚠️ Year filter would return 0 results, keeping {len(last_valid_indices)} previous results")
        
        # Filter 4: Minimum Rating
        if filters.get('minRating') and filters['minRating'] > 0:
            filtered_indices = []
            for idx in candidate_indices:
                book = df.iloc[idx]
                book_rating = book.get('averageRating', 0)
                if book_rating >= filters['minRating']:
                    filtered_indices.append(idx)
            
            if filtered_indices:
                candidate_indices = filtered_indices
                last_valid_indices = candidate_indices.copy()
                print(f"📊 After rating filter: {len(candidate_indices)} results")
            else:
                print(f"⚠️ Rating filter would return 0 results, keeping {len(last_valid_indices)} previous results")
        
        # Filter 5: Language
        if filters.get('language') and filters['language'] != 'All':
            filtered_indices = []
            for idx in candidate_indices:
                book = df.iloc[idx]
                book_lang = str(book.get('language', '')).lower()
                if filters['language'].lower() in book_lang:
                    filtered_indices.append(idx)
            
            if filtered_indices:
                candidate_indices = filtered_indices
                last_valid_indices = candidate_indices.copy()
                print(f"📊 After language filter: {len(candidate_indices)} results")
            else:
                print(f"⚠️ Language filter would return 0 results, keeping {len(last_valid_indices)} previous results")
        
        # Use the last valid result
        candidate_indices = last_valid_indices
        print(f"✅ Final candidates after progressive filtering: {len(candidate_indices)} results")
    
    # If still no results (shouldn't happen with progressive filtering), return empty
    if not candidate_indices:
        print("❌ No results found")
        return []
    
    # 5. Rerank (Chấm điểm lại bằng Cross-Encoder)
    candidates_text = [df.iloc[idx]['search_text'] for idx in candidate_indices]
    cross_input = [[query, doc_text] for doc_text in candidates_text]
    cross_scores = cross_encoder.predict(cross_input)
    
    # 6. Format kết quả
    results = []
    for i, idx in enumerate(candidate_indices):
        results.append({'index': idx, 'score': float(cross_scores[i])}) 
        
    results = sorted(results, key=lambda x: x['score'], reverse=True)[:10]
    final_indices = [item['index'] for item in results]
    
    # Trả về JSON
    return df.iloc[final_indices].to_dict('records')

# --- API ROUTE ---
@app.route('/search', methods=['GET'])
def search_endpoint():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    # Parse filter parameters
    filters = {}
    
    # Genres (comma-separated)
    genres = request.args.get('genres', '')
    if genres:
        filters['genres'] = [g.strip() for g in genres.split(',') if g.strip()]
    
    # Author
    author = request.args.get('author', '')
    if author:
        filters['author'] = author
    
    # Year range
    year_min = request.args.get('yearMin', '')
    if year_min:
        try:
            filters['yearMin'] = int(year_min)
        except ValueError:
            pass
    
    year_max = request.args.get('yearMax', '')
    if year_max:
        try:
            filters['yearMax'] = int(year_max)
        except ValueError:
            pass
    
    # Minimum rating
    min_rating = request.args.get('minRating', '')
    if min_rating:
        try:
            filters['minRating'] = float(min_rating)
        except ValueError:
            pass
    
    # Language
    language = request.args.get('language', '')
    if language:
        filters['language'] = language
    
    try:
        results = search_engine(query, filters=filters if filters else None)
        return jsonify(results)
    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)