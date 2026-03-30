import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build the page numbers to render (show up to 5 around current)
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, page - delta);
    const rangeEnd = Math.min(totalPages - 1, page + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-8 pb-4"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                   text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((p, idx) =>
        p === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-10 h-10 inline-flex items-center justify-center text-sm text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
              ${
                p === page
                  ? 'bg-[#2A75FF] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                   text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
