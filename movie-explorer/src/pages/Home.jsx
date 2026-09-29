import { useState, useCallback } from "react";
import { Container, Typography, FormControlLabel, Switch, Paper, Stack, Box } from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import MovieGrid from "../components/MovieGrid";
import useMovieList from "../hooks/useMovieList";
import useDebounce from "../hooks/useDebounce";
import { getTrending, searchMovies, discoverMovies } from "../api/tmdb";
import { useApp } from "../context/useApp";

export default function Home() {
  const { lastSearch, setLastSearch } = useApp();
  const [query, setQuery] = useState(lastSearch);
  const [filters, setFilters] = useState({ genre: "", year: "", rating: "" });
  const [loadMoreMode, setLoadMoreMode] = useState(false);

  // Debounced so typing a year doesn't fire a request per keystroke
  const debouncedFilters = useDebounce(filters, 500);
  const filtersActive = Boolean(debouncedFilters.genre || debouncedFilters.year || debouncedFilters.rating);

  // fetcher identity only changes when query/filters change, which resets the list
  const fetcher = useCallback(
    (page) => {
      if (query) return searchMovies(query, page);
      if (filtersActive) return discoverMovies(debouncedFilters, page);
      return getTrending(page);
    },
    [query, debouncedFilters, filtersActive]
  );

  const list = useMovieList(fetcher);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    setLastSearch(q); // persist last search
  }, [setLastSearch]);

  const heading = query
    ? `Results for “${query}”`
    : filtersActive
    ? "Filtered Movies"
    : "Trending This Week";

  return (
    <Box>
      {!query && <Hero />}

      <Container sx={{ py: 4 }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 2, sm: 2.5 }, mb: 4, borderRadius: 3 }}
        >
          <Stack spacing={2}>
            <SearchBar initialValue={lastSearch} onSearch={handleSearch} />
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <GenreFilter filters={filters} onChange={setFilters} />
              <FormControlLabel
                sx={{ ml: { sm: "auto" }, whiteSpace: "nowrap" }}
                control={<Switch checked={loadMoreMode} onChange={(e) => setLoadMoreMode(e.target.checked)} />}
                label={<Typography variant="body2" color="text.secondary">“Load More” button</Typography>}
              />
            </Stack>
          </Stack>
        </Paper>

        <Stack direction="row" alignItems="center" spacing={1.25} mb={2.5}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2, display: "grid", placeItems: "center",
              bgcolor: query ? "primary.main" : filtersActive ? "primary.main" : "warning.main",
              color: "#fff",
            }}
          >
            {query ? <SearchIcon fontSize="small" /> : filtersActive ? <TuneIcon fontSize="small" /> : <LocalFireDepartmentIcon fontSize="small" />}
          </Box>
          <Typography variant="h5" fontWeight={700}>{heading}</Typography>
        </Stack>

        <MovieGrid {...list} mode={loadMoreMode ? "loadmore" : "infinite"} />
      </Container>
    </Box>
  );
}
