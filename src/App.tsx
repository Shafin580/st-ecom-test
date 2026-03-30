import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, RefreshCw, PackageX, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { api } from './services/api';
import { useDebounce } from './hooks/useDebounce';
import { useCartStore } from './store/useCartStore';
import ProductCard from './components/ProductCard';
import ProductSkeleton from './components/ProductSkeleton';
import Pagination from './components/Pagination';
import CartDrawer from './components/CartDrawer';

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Outdoors'];
const ITEMS_PER_PAGE = 12;

// ─── URL Param helpers ───────────────────────────────────────────────────────
function readParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    page: Number(p.get('page') || '1'),
    category: p.get('category') || '',
    search: p.get('search') || '',
  };
}

function writeParams(updates: Record<string, string | number | null>) {
  const current = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([k, v]) => {
    if (v === null || v === '' || v === undefined) current.delete(k);
    else current.set(k, String(v));
  });
  const qs = current.toString();
  window.history.pushState(
    {},
    '',
    qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
  );
  window.dispatchEvent(new Event('urlchange'));
}

// ─── Custom hook: sync React state with URL ──────────────────────────────────
function useUrlState() {
  const [state, setState] = useState(readParams);

  useEffect(() => {
    const handler = () => setState(readParams());
    window.addEventListener('urlchange', handler);
    window.addEventListener('popstate', handler);
    return () => {
      window.removeEventListener('urlchange', handler);
      window.removeEventListener('popstate', handler);
    };
  }, []);

  return state;
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  const { page, category, search } = useUrlState();
  const totalCartItems = useCartStore((s) => s.items.length);
  const toggleCart = useCartStore((s) => s.toggleCart);

  // Local input state — we debounce this before writing to URL
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // When debounced value changes → update URL (and reset to page 1)
  useEffect(() => {
    if (debouncedSearch !== search) {
      writeParams({ search: debouncedSearch || null, page: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Keep local input synced when URL changes externally (e.g. browser back)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // ─── Tanstack Query ──────────────────────────────────────────────────────
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', { page, category, search, limit: ITEMS_PER_PAGE }],
    queryFn: () =>
      api.fetchProducts({
        page,
        limit: ITEMS_PER_PAGE,
        category: category || undefined,
        search: search || undefined,
      }),
  });

  // Show toast on error
  useEffect(() => {
    if (isError) {
      toast.error('Failed to load products', {
        description: (error as Error)?.message || 'The server might be overloaded. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => refetch(),
        },
      });
    }
  }, [isError, error, refetch]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    writeParams({ category: e.target.value || null, page: null });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    writeParams({ page: newPage <= 1 ? null : newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────
  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;
  const total = data?.total ?? 0;

  const showSkeleton = isLoading;
  const showEmpty = !isLoading && !isError && products.length === 0;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 lg:px-12 max-w-[1400px] mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="glass-panel p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Premium Products
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {total > 0
                ? `Showing ${products.length} of ${total} products`
                : 'Browse our curated collection'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Subtle refetch indicator */}
            {isFetching && !isLoading && (
              <RefreshCw
                size={18}
                className="animate-spin"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Refreshing data"
              />
            )}

            {/* Cart button — only visible when items are in cart */}
            {totalCartItems > 0 && (
              <button
                onClick={toggleCart}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl
                           hover:bg-slate-100 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={20} className="text-slate-600" />
                <span className="absolute -top-1 -right-1 bg-[#2A75FF] text-white text-[10px] font-bold
                                 w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {totalCartItems}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div
          className="glass-panel flex items-center px-4 py-3 flex-1 max-w-md"
        >
          <Search size={18} color="var(--text-muted)" className="mr-3 shrink-0" />
          <input
            id="search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
            className="bg-transparent border-none outline-none w-full text-sm"
            style={{ color: 'var(--text-main)' }}
          />
        </div>

        {/* Category filter */}
        <select
          id="category-select"
          className="glass-panel px-4 py-3 text-sm cursor-pointer outline-none"
          style={{ color: 'var(--text-main)', appearance: 'none', minWidth: '160px' }}
          value={category}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        >
          <option value="" style={{ background: 'var(--surface)' }}>All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c.toLowerCase()} style={{ background: 'var(--surface)' }}>
              {c}
            </option>
          ))}
        </select>
      </section>

      {/* ── Product Grid ───────────────────────────────────────────────────── */}
      <main>
        {/* Skeleton loader */}
        {showSkeleton && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageX size={48} className="mb-4 text-slate-300" />
            <h2 className="text-lg font-semibold mb-1">No products found</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Product cards */}
        {!showSkeleton && products.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${category}-${search}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* ── Cart Drawer ────────────────────────────────────────────────────── */}
      <CartDrawer />
    </div>
  );
}

export default App;
