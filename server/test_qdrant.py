import os
from qdrant_client import QdrantClient

# 1. Cấu hình
current_dir = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(current_dir, 'qdrant_db') 
COLLECTION_NAME = "books_hybrid"

print(f"📂 Đang kiểm tra DB tại: {DB_PATH}")

# 2. Kết nối
if not os.path.exists(DB_PATH):
    print("❌ LỖI: Thư mục qdrant_db không tồn tại!")
    exit()

client = QdrantClient(path=DB_PATH)

# 3. Kiểm tra Collection
try:
    # Lấy thông tin collection
    collection_info = client.get_collection(COLLECTION_NAME)
    print(f"✅ Kết nối OK! Trạng thái Collection '{COLLECTION_NAME}':")
    print(f"   - Tổng số vector (points): {collection_info.points_count}")
    print(f"   - Trạng thái: {collection_info.status}")

    if collection_info.points_count == 0:
        print("⚠️ CẢNH BÁO: Database rỗng (0 sách). Bạn cần copy folder DB từ Kaggle về đè lên thư mục này.")
        exit()

    # 4. Lấy thử 1 cuốn sách để xem dữ liệu
    print("\n🔍 Soi thử 1 cuốn sách đầu tiên:")
    # Scroll lấy 1 item
    res, _ = client.scroll(
        collection_name=COLLECTION_NAME,
        limit=1,
        with_payload=True,
        with_vectors=False
    )
    
    if res:
        book = res[0].payload
        print(f"   - Title: {book.get('title')}")
        print(f"   - Year: {book.get('year')} (Kiểm tra xem có bị bằng 0 không?)")
        print(f"   - Rating: {book.get('rating')}")
    else:
        print("❌ Không lấy được sách nào dù points_count > 0.")

except Exception as e:
    print(f"❌ Lỗi: {e}")
    print("👉 Khả năng cao là tên Collection bị sai hoặc file DB bị hỏng.")