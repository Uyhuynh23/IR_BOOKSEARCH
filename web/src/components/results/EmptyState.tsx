export default function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(196,30,58,0.08)",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
      <h2 style={{ color: "#2B2B2B", marginBottom: "0.5rem" }}>
        Không tìm thấy cuốn sách nào
      </h2>
      <p style={{ color: "#6B7280" }}>
        Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
      </p>
    </div>
  );
}
