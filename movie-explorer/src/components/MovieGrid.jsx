import { Grid, CircularProgress, Alert, Box, Button, Typography } from "@mui/material";
import MovieCard from "./MovieCard";

// Renders a movie grid with either infinite scroll or a "Load More" button
export default function MovieGrid({ movies, loading, error, hasMore, loadMore, retry, sentinelRef, mode = "infinite" }) {
  const idle = !loading && !error;
  return (
    <>
      {!loading && !error && movies.length === 0 && (
        <Typography align="center" sx={{ my: 4 }}>No movies found.</Typography>
      )}
      <Grid container spacing={2}>
        {movies.map((m) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}>
            <MovieCard movie={m} />
          </Grid>
        ))}
      </Grid>
      {error && (
        <Alert
          severity="error"
          sx={{ my: 2 }}
          action={retry && <Button color="inherit" size="small" onClick={retry}>Try again</Button>}
        >
          {error}
        </Alert>
      )}
      <Box textAlign="center" my={3}>
        {loading && <CircularProgress />}
        {mode === "loadmore" && hasMore && idle && (
          <Button variant="contained" onClick={loadMore}>Load More</Button>
        )}
        {/* Only mounted while idle so it re-triggers after each page loads */}
        {mode === "infinite" && hasMore && idle && <div ref={sentinelRef} style={{ height: 20 }} />}
      </Box>
    </>
  );
}
