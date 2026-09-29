import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Chip, Box, CircularProgress, Alert, Button, Stack } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import { getMovieDetails, IMG_URL } from "../api/tmdb";
import { useApp } from "../context/useApp";

// Full movie view: overview, genres, cast and YouTube trailer
export default function MovieDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useApp();
  // Tagged with the id it belongs to, so loading is derived instead of reset in the effect
  const [result, setResult] = useState({ id: null, movie: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    getMovieDetails(id)
      .then((movie) => !cancelled && setResult({ id, movie, error: "" }))
      .catch((e) => !cancelled && setResult({ id, movie: null, error: e.message }));
    return () => { cancelled = true; };
  }, [id]);

  if (result.id !== id) return <Box textAlign="center" mt={8}><CircularProgress /></Box>;
  if (result.error) return <Container sx={{ py: 4 }}><Alert severity="error">{result.error}</Alert></Container>;

  const { movie } = result;
  const trailer =
    movie.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    movie.videos?.results.find((v) => v.site === "YouTube");
  const cast = movie.credits?.cast.slice(0, 8) || [];
  const year = movie.release_date?.slice(0, 4);

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" gap={3} flexDirection={{ xs: "column", md: "row" }}>
        {movie.poster_path ? (
          <Box component="img" src={`${IMG_URL}${movie.poster_path}`} alt={movie.title}
               sx={{ width: { xs: "100%", md: 300 }, alignSelf: "flex-start", borderRadius: 2 }} />
        ) : (
          <Box sx={{ width: { xs: "100%", md: 300 }, aspectRatio: "2/3", flexShrink: 0, borderRadius: 2,
                     display: "grid", placeItems: "center", bgcolor: "action.hover" }}>
            <MovieIcon sx={{ fontSize: 96, color: "text.disabled" }} />
          </Box>
        )}
        <Box>
          <Typography variant="h4">{movie.title}{year && ` (${year})`}</Typography>
          <Typography color="text.secondary" gutterBottom>
            ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "–"}
            {movie.runtime ? ` • ${movie.runtime} min` : ""}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} my={1}>
            {movie.genres?.map((g) => <Chip key={g.id} label={g.name} />)}
          </Stack>
          <Typography my={2}>{movie.overview || "No overview available."}</Typography>
          {cast.length > 0 && (
            <>
              <Typography variant="h6">Cast</Typography>
              <Typography mb={2}>{cast.map((c) => c.name).join(", ")}</Typography>
            </>
          )}
          <Button variant="outlined" onClick={() => toggleFavorite(movie)}>
            {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </Box>
      </Box>

      {trailer && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Trailer</Typography>
          <Box sx={{ position: "relative", pb: "56.25%", height: 0 }}>
            <iframe title={`${movie.title} trailer`} src={`https://www.youtube.com/embed/${trailer.key}`} allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} />
          </Box>
          <Button href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" sx={{ mt: 1 }}>
            Open on YouTube
          </Button>
        </Box>
      )}
    </Container>
  );
}
