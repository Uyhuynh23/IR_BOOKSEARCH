import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, MatchText, Range
from sentence_transformers import SentenceTransformer, CrossEncoder

app = Flask(__name__)
CORS(app) # Cho phép mọi nguồn (Frontend React/Nextjs) gọi API

# ==========================================
# 1. CẤU HÌNH HỆ THỐNG
# ==========================================
current_dir = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(current_dir, 'qdrant_db') 
COLLECTION_NAME = "books_hybrid"

# Tên Model (Sẽ tự tải về máy nếu chưa có)
BI_MODEL_NAME = 'all-MiniLM-L6-v2'
CROSS_MODEL_NAME = 'cross-encoder/ms-marco-MiniLM-L-6-v2'

print("⏳ Đang khởi động Server...")

# ==========================================
# 2. KẾT NỐI DATABASE & AI MODELS
# ==========================================

# --- A. Kết nối Qdrant Database ---
print(f"📂 Đang kết nối Qdrant tại: {DB_PATH}")

if os.path.exists(DB_PATH):
    client = QdrantClient(path=DB_PATH)
    # Kiểm tra ngay xem DB có dữ liệu không
    try:
        col_info = client.get_collection(COLLECTION_NAME)
        print(f"✅ Đã tìm thấy Collection '{COLLECTION_NAME}'")
        print(f"📊 Số lượng vectors hiện có: {col_info.points_count}")
        
        if col_info.points_count == 0:
            print("⚠️ CẢNH BÁO: Kết nối thành công nhưng Database đang RỖNG!")
    except Exception as e:
        print(f"❌ LỖI NGHIÊM TRỌNG: Không tìm thấy Collection '{COLLECTION_NAME}'.")
        print("👉 Gợi ý: Kiểm tra xem file zip từ Kaggle đã giải nén đúng cấu trúc chưa.")
else:
    print("❌ LỖI: Không tìm thấy thư mục 'qdrant_db'. Đang chạy ở chế độ RAM (sẽ không có dữ liệu).")
    client = QdrantClient(":memory:") 

# --- B. Load Model AI ---
print("🧠 Đang tải AI Models (Lần đầu chạy sẽ mất 1-2 phút)...")
try:
    bi_encoder = SentenceTransformer(BI_MODEL_NAME)
    cross_encoder = CrossEncoder(CROSS_MODEL_NAME)
    print("✅ AI Models đã sẵn sàng!")
except Exception as e:
    print(f"❌ Lỗi tải Model: {e}")

# ==========================================
# 3. CÔNG CỤ TẠO BỘ LỌC (FILTER)
# ==========================================
def build_qdrant_filter(filters):
    """Chuyển tham số từ URL thành Qdrant Filter"""
    if not filters: return None
    
    must_conditions = []

    # 1. Genres (Thể loại)
    if filters.get('genres') and len(filters['genres']) > 0:
        should_conditions = []
        for genre in filters['genres']:
            should_conditions.append(
                FieldCondition(key="categories", match=MatchText(text=genre))
            )
        must_conditions.append(Filter(should=should_conditions))

    # 2. Author (Tác giả)
    if filters.get('author'):
        must_conditions.append(
            FieldCondition(key="authors", match=MatchText(text=filters['author']))
        )

    # 3. Năm xuất bản
    if filters.get('yearMin') or filters.get('yearMax'):
        range_params = {}
        if filters.get('yearMin'): range_params['gte'] = filters['yearMin']
        if filters.get('yearMax'): range_params['lte'] = filters['yearMax']
        must_conditions.append(
            FieldCondition(key="year", range=Range(**range_params))
        )

    # 4. Đánh giá (Rating)
    if filters.get('minRating'):
        must_conditions.append(
            FieldCondition(key="rating", range=Range(gte=filters['minRating']))
        )

    # 5. Ngôn ngữ
    if filters.get('language') and filters['language'].lower() != 'all':
         must_conditions.append(
             FieldCondition(key="language", match=MatchValue(value=filters['language']))
         )

    if not must_conditions: return None
    return Filter(must=must_conditions)


# ==========================================
# 4. HÀM TÌM KIẾM CHÍNH (SEARCH ENGINE)
# ==========================================
def search_engine(query, top_k=20, filters=None):
    # Bước 1: Encode Query -> Vector
    try:
        vector = bi_encoder.encode(query).tolist()
    except Exception as e:
        print(f"❌ Lỗi encode: {e}")
        return []

    # Bước 2: Search Qdrant (Code tương thích mọi version)
    q_filter = build_qdrant_filter(filters)
    
    try:
        # Kiểm tra xem client có hàm 'search' mới không, nếu không dùng 'search_points'
        if hasattr(client, 'search'):
            search_result = client.search(
                collection_name=COLLECTION_NAME,
                query_vector=vector,
                query_filter=q_filter,
                limit=50
            )
        else:
            # FALLBACK: Dùng cho phiên bản cũ hơn
            search_result = client.search_points(
                collection_name=COLLECTION_NAME,
                vector=vector,       # Bản cũ dùng 'vector' thay vì 'query_vector'
                filter=q_filter,     # Bản cũ dùng 'filter' thay vì 'query_filter'
                limit=50,
                with_payload=True
            )
    except Exception as e:
        print(f"❌ Lỗi Qdrant Search: {e}")
        # Cố gắng vớt vát lần cuối với cú pháp cổ điển
        try:
             search_result, _ = client.scroll(
                collection_name=COLLECTION_NAME,
                scroll_filter=q_filter,
                limit=50
            )
        except:
            return []

    if not search_result:
        return []

    # Bước 3: Chuẩn bị dữ liệu cho Rerank
    candidates = []
    for hit in search_result:
        item = hit.payload
        # Tạo đoạn văn mô tả để AI đọc hiểu
        text_for_rerank = f"{item.get('title', '')} by {item.get('authors','')}. {item.get('description', '')[:300]}"
        
        candidates.append({
            'payload': item,
            'rerank_text': text_for_rerank
        })

    # Bước 4: Reranking (Chấm điểm lại bằng Cross-Encoder)
    if not candidates: return []

    cross_inputs = [[query, c['rerank_text']] for c in candidates]
    cross_scores = cross_encoder.predict(cross_inputs)

    # Gán điểm mới và chuẩn hóa tên field cho Frontend
    for i, candidate in enumerate(candidates):
        payload = candidate['payload']
        payload['score'] = float(cross_scores[i])
        
        # Chuẩn hóa các field name để match với TypeScript interface
        if 'bookID' in payload and 'book_id' not in payload:
            payload['book_id'] = payload['bookID']
        
        # Map từ tên field trong DB -> tên field Frontend expect
        if 'rating' in payload:
            payload['average_rating'] = payload['rating']
        if 'year' in payload:
            payload['published_year'] = str(payload['year'])
        if 'categories' in payload:
            payload['google_category'] = payload['categories']

    # Sắp xếp giảm dần theo điểm mới
    ranked_results = sorted(candidates, key=lambda x: x['payload']['score'], reverse=True)

    # Trả về Top K kết quả tốt nhất
    return [x['payload'] for x in ranked_results[:top_k]]

# ==========================================
# 5. API ENDPOINTS
# ==========================================
@app.route('/search', methods=['GET'])
def search_endpoint():
    query = request.args.get('q', '').strip()
    
    # Lấy các tham số filter từ URL
    filters = {}
    genres = request.args.get('genres', '')
    if genres and genres.lower() != 'all':
        filters['genres'] = [g.strip() for g in genres.split(',') if g.strip()]
    
    if request.args.get('author'): filters['author'] = request.args.get('author')
    
    try:
        if request.args.get('yearMin'): filters['yearMin'] = int(request.args.get('yearMin'))
        if request.args.get('yearMax'): filters['yearMax'] = int(request.args.get('yearMax'))
        if request.args.get('minRating'): filters['minRating'] = float(request.args.get('minRating'))
    except: pass

    lang = request.args.get('language', '')
    if lang: filters['language'] = lang

    try:
        # Allow search with filters only (empty query) if filters are provided
        if not query and not filters:
            return jsonify({"error": "Vui lòng nhập từ khóa tìm kiếm hoặc chọn bộ lọc"}), 400
        
        # If query is empty but filters exist, use a wildcard search
        search_query = query if query else "*"
        
        print(f"🔍 Đang tìm: '{search_query}' | Filters: {filters}")
        results = search_engine(search_query, filters=filters)
        return jsonify(results)
    
    except Exception as e:
        print(f"❌ Server Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/recommend', methods=['POST'])
def recommend_endpoint():
    data = request.json
    liked_ids = data.get('liked_ids', [])
    valid_ids = [int(i) for i in liked_ids if str(i).isdigit()]

    if not valid_ids: return jsonify([])

    try:
        hits = client.recommend(
            collection_name=COLLECTION_NAME,
            positive=valid_ids,
            limit=10
        )
        return jsonify([hit.payload for hit in hits])
    except Exception as e:
        print(f"⚠️ Lỗi Recommend: {e}")
        return jsonify([])

if __name__ == '__main__':
    # 🔥 QUAN TRỌNG: Chạy port 5001 để tránh xung đột trên MacOS
    print("🚀 SERVER ĐANG CHẠY TẠI: http://127.0.0.1:5001")
    app.run(port=5001, debug=True, use_reloader=False)