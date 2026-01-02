interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "3rem",
      }}
    >
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.3 : 1,
          color: "#C41E3A",
        }}
      >
        ‹
      </button>

      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = i + 1;
        } else if (currentPage <= 3) {
          pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
          pageNum = totalPages - 4 + i;
        } else {
          pageNum = currentPage - 2 + i;
        }

        return (
          <button
            key={i}
            onClick={() => onPageChange(pageNum)}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "8px",
              border: "none",
              background: currentPage === pageNum ? "#C41E3A" : "#fff",
              color: currentPage === pageNum ? "#fff" : "#2B2B2B",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow:
                currentPage === pageNum
                  ? "0 2px 8px rgba(196,30,58,0.2)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== pageNum) {
                e.currentTarget.style.background = "#FFFDF8";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== pageNum) {
                e.currentTarget.style.background = "#fff";
              }
            }}
          >
            {pageNum}
          </button>
        );
      })}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <span style={{ color: "#6B7280" }}>...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "8px",
              border: "none",
              background: "#fff",
              color: "#2B2B2B",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        style={{
          background: "transparent",
          border: "none",
          fontSize: "1.5rem",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.3 : 1,
          color: "#C41E3A",
        }}
      >
        ›
      </button>
    </div>
  );
}
