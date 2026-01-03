import os
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer

# 1. Cấu hình
current_dir = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(current_dir, 'qdrant_db') 
COLLECTION_NAME = "books_hybrid"
MODEL_NAME = 'all-MiniLM-L6-v2'

print("="*50)
print("🕵️‍♂️ DEBUGGING SEARCH PIPELINE")
print("="*50)

# 2. Kết nối
if not os.path.exists(DB_PATH):
    print("❌ Lỗi: Không thấy thư mục qdrant_db")
    exit()
    
client = QdrantClient(path=DB_PATH)
print(f"✅ DB Path: {DB_PATH}")

# 3. Load Model
print(f"⏳ Loading Model {MODEL_NAME}...")
model = SentenceTransformer(MODEL_NAME)

# 4. Test Search: "Harry Potter"
query_text = "Harry Potter"
print(f"\n🧪 Đang thử search từ khóa: '{query_text}'")

# Tạo vector
vector = model.encode(query_text).tolist()
print(f"   -> Đã tạo vector (384 chiều). 5 giá trị đầu: {vector[:5]}")

# THỬ NGHIỆM 1: Search kiểu MỚI (client.search)
print("\n[TEST 1] Thử dùng client.search() (API mới)...")
try:
    if hasattr(client, "search"):
        res = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=vector, # Default Vector (không đặt tên)
            limit=3
        )
        print(f"   👉 Kết quả: Tìm thấy {len(res)} sách.")
        for hit in res:
            print(f"      - {hit.payload['title']} (Score: {hit.score:.4f})")
    else:
        print("   ⚠️ Client này quá cũ, không có hàm .search()")
except Exception as e:
    print(f"   ❌ Lỗi TEST 1: {e}")

# THỬ NGHIỆM 2: Search kiểu CŨ (client.query_points)
# Đây là cái app.py đang dùng
print("\n[TEST 2] Thử dùng client.query_points() (API cũ)...")
try:
    if hasattr(client, "query_points"):
        res_tuple = client.query_points(
            collection_name=COLLECTION_NAME,
            query=vector, # Default Vector
            limit=3,
            with_payload=True
        )
        
        # Xử lý kết quả trả về (List hoặc Tuple)
        final_res = []
        if isinstance(res_tuple, tuple):
            print("   ℹ️ API trả về dạng Tuple (Results, Offset)")
            final_res = res_tuple[0]
        else:
            print("   ℹ️ API trả về dạng List chuẩn")
            final_res = res_tuple
            
        print(f"   👉 Kết quả: Tìm thấy {len(final_res)} sách.")
        for hit in final_res:
            print(f"      - {hit.payload['title']} (Score: {hit.score:.4f})")
    else:
        print("   ⚠️ Client này không có hàm .query_points()")
except Exception as e:
    print(f"   ❌ Lỗi TEST 2: {e}")

print("\n"+"="*50)