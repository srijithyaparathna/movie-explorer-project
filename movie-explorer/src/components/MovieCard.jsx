import { Card, CardActionArea, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import MovieIcon from "@mui/icons-material/Movie";
import { Link } from "react-router-dom";
import { IMG_URL } from "../api/tmdb";
import { useApp } from "../context/useApp";

// Poster card showing title, release year and rating, with a favorite toggle
export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useApp();
  const year = movie.release_date?.slice(0, 4) || "N/A";
  const favorite = isFavorite(movie.id);

  return (
    <Card sx={{ position: "relative", height: "100%" }}>
      <IconButton
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        onClick={() => toggleFavorite(movie)}
        sx={{ position: "absolute", top: 4, right: 4, zIndex: 1, bgcolor: "rgba(0,0,0,.5)", color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,.7)" } }}
      >
        {favorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <CardActionArea component={Link} to={`/movie/${movie.id}`}>
        {movie.poster_path ? (
          <CardMedia component="img" image={`${IMG_URL}${movie.poster_path}`} alt={movie.title}
                     loading="lazy" sx={{ aspectRatio: "2/3" }} />
        ) : (
          <Box sx={{ aspectRatio: "2/3", display: "grid", placeItems: "center", bgcolor: "action.hover" }}>
            <MovieIcon sx={{ fontSize: 64, color: "text.disabled" }} />
          </Box>
        )}
        <CardContent>
          <Typography variant="subtitle1" noWrap fontWeight={600}>{movie.title}</Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">{year}</Typography>
            <Box display="flex" alignItems="center">
              <StarIcon fontSize="small" color="warning" />
              <Typography variant="body2">{movie.vote_average ? movie.vote_average.toFixed(1) : "–"}</Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
