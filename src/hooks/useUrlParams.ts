import { useCallback, useMemo } from 'react';

/**
 * Reads and writes URL search params using the browser's native URLSearchParams.
 * We use window.location.search directly and pushState to avoid full-page reloads.
 */
function getParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

export function useUrlParams() {
  // Read current params on every render — cheap since it's just parsing the URL string.
  const params = useMemo(() => getParams(), [window.location.search]);

  const page = Number(params.get('page') || '1');
  const category = params.get('category') || '';
  const search = params.get('search') || '';

  const setParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const current = getParams();

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '' || value === undefined) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      const qs = current.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.pushState({}, '', newUrl);

      // Dispatch a custom event so React components can react to URL changes
      window.dispatchEvent(new Event('urlchange'));
    },
    [],
  );

  return { page, category, search, setParams };
}
