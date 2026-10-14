
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
}) => {
  const page = Math.max(1, Math.min(currentPage, totalPages));
  const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, "right", totalPages];
    }

    if (page >= totalPages - 2) {
      return [
        1,
        "left",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "left",
      page - 1,
      page,
      page + 1,
      "right",
      totalPages,
    ];
  };

  const buttonClass =
    "flex h-9 min-w-9 items-center justify-center rounded-lg border border-[var(--border)] px-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  if (totalPages <= 1) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-4">
        <p className="text-sm text-[var(--text-muted)]">
          Showing {startItem}-{endItem} of {totalItems} items
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--text-muted)]">
        Showing{" "}
        <span className="font-medium text-[var(--text-primary)]">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[var(--text-primary)]">
          {totalItems}
        </span>{" "}
        items
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`${buttonClass} text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]`}
          disabled={page === 1}
          onClick={() => onPageChange?.(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>

        {getPages().map((pageNumber, index) => {
          if (typeof pageNumber !== "number") {
            return (
              <span
                key={`${pageNumber}-${index}`}
                className="flex h-9 min-w-8 items-center justify-center text-[var(--text-muted)]"
                aria-hidden="true"
              >
                <MoreHorizontal size={18} />
              </span>
            );
          }

          const isActive = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange?.(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? "page" : undefined}
              className={`${buttonClass} ${
                isActive
                  ? "border-[var(--primary)] bg-[var(--primary)] font-semibold text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          className={`${buttonClass} text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]`}
          disabled={page === totalPages}
          onClick={() => onPageChange?.(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
