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
def search_engine(query, top_k=20):
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
    
    # 4. Rerank (Chấm điểm lại bằng Cross-Encoder)
    candidates_text = [df.iloc[idx]['search_text'] for idx in candidate_indices]
    cross_input = [[query, doc_text] for doc_text in candidates_text]
    cross_scores = cross_encoder.predict(cross_input)
    
    # 5. Format kết quả
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
    
    try:
        results = search_engine(query)
        return jsonify(results)
    except Exception as e:
        print(f"Search Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)