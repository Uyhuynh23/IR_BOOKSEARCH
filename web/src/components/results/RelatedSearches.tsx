interface RelatedSearchesProps {
  searches: string[];
  onSearch: (query: string) => void;
}

export default function RelatedSearches({
  searches,
  onSearch,
}: RelatedSearchesProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 100%)",
        borderRadius: "16px",
        padding: "2rem",
        marginBottom: "3rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>💡</span>
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#2B2B2B",
            margin: 0,
          }}
        >
          Gợi ý tìm kiếm khác:
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {searches.map((search) => (
          <button
            key={search}
            onClick={() => onSearch(search)}
            style={{
              background: "#fff",
              color: "#C41E3A",
              border: "1.5px solid #F5C77A",
              borderRadius: "24px",
              padding: "0.5rem 1.25rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#C41E3A";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#C41E3A";
            }}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
