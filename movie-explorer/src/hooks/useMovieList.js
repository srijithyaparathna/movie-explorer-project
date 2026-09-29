import { useState, useEffect, useCallback, useRef } from "react";

// TMDb rejects page numbers above 500 even when total_pages is larger
const MAX_PAGES = 500;

const initialState = (fetcher) => ({
  fetcher,
  page: 1,
  attempt: 0, // bumped by retry() to re-run the same page request
  movies: [],
  totalPages: 1,
  loading: true,
  error: "",
});

// Append new results, dropping movies already in the list (TMDb pages can overlap)
const mergeUnique = (prev, next) => {
  const seen = new Set(prev.map((m) => m.id));
  return [...prev, ...next.filter((m) => !seen.has(m.id))];
};

/**
 * Paginated movie list for a `fetcher(page)` function.
 * Changing the fetcher (new query/filters) resets the list to page 1.
 */
export default function useMovieList(fetcher) {
  const [state, setState] = useState(() => initialState(fetcher));

  // Reset during render when the data source changes, so no stale page is requested
  if (state.fetcher !== fetcher) setState(initialState(fetcher));

  const { page, attempt } = state;

  useEffect(() => {
    let cancelled = false;
    fetcher(page)
      .then((data) => {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          movies: page === 1 ? data.results : mergeUnique(s.movies, data.results),
          totalPages: Math.min(data.total_pages, MAX_PAGES),
          loading: false,
        }));
      })
      .catch((e) => {
        if (!cancelled) setState((s) => ({ ...s, error: e.message, loading: false }));
      });
    return () => { cancelled = true; };
  }, [fetcher, page, attempt]);

  const hasMore = state.page < state.totalPages;

  const loadMore = useCallback(() => {
    setState((s) =>
      s.loading || s.error || s.page >= s.totalPages
        ? s
        : { ...s, page: s.page + 1, loading: true }
    );
  }, []);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, attempt: s.attempt + 1, loading: true, error: "" }));
  }, []);

  // Attach this ref to a sentinel element for infinite scroll.
  // The sentinel is re-mounted after each load, so observing it again
  // triggers another load if it is still on screen.
  const observer = useRef(null);
  const sentinelRef = useCallback(
    (node) => {
      observer.current?.disconnect();
      observer.current = null;
      if (!node) return;
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMore();
      }, { rootMargin: "200px" });
      observer.current.observe(node);
    },
    [loadMore]
  );

  return {
    movies: state.movies,
    loading: state.loading,
    error: state.error,
    hasMore,
    loadMore,
    retry,
    sentinelRef,
  };
}
