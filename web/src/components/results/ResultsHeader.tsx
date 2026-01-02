interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  query: string;
  hasFilters: boolean;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ResultsHeader({
  filteredCount,
  totalCount,
  query,
  hasFilters,
  sortBy,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#2B2B2B",
          marginBottom: "0.5rem",
        }}
      >
        Tìm thấy {filteredCount} cuốn sách cho{" "}
        <span style={{ color: "#C41E3A" }}>'{query}'</span>
        {hasFilters && (
          <span style={{ fontSize: "1rem", color: "#6B7280", fontWeight: 400 }}>
            {" "}
            (đã lọc từ {totalCount})
          </span>
        )}
      </h1>

      {/* Sort Options */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.9rem", color: "#6B7280" }}>
          Sắp xếp theo:
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1.5px solid #F5C77A",
            background: "#fff",
            color: "#2B2B2B",
            fontSize: "0.9rem",
            cursor: "pointer",
            outline: "none",
            margin: 0,
          }}
        >
          <option value="relevance">Độ liên quan</option>
          <option value="rating">Đánh giá cao nhất</option>
          <option value="year">Năm xuất bản</option>
          <option value="title">Tên sách A-Z</option>
        </select>
      </div>
    </div>
  );
}
