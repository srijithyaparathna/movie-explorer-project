import { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Chip, Stack, Skeleton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { getTrending, BACKDROP_URL } from "../api/tmdb";

// Big backdrop banner for the #1 trending movie, shown above the grid on Home
export default function Hero() {
  const [movie, setMovie] = useState(undefined); // undefined = loading, null = unavailable

  useEffect(() => {
    let cancelled = false;
    getTrending()
      .then((data) => {
        if (!cancelled) setMovie(data.results.find((m) => m.backdrop_path) || null);
      })
      .catch(() => !cancelled && setMovie(null));
    return () => { cancelled = true; };
  }, []);

  if (movie === null) return null; // fails silently, page still works without the banner

  return (
    <Box
      sx={{
        position: "relative",
        color: "#fff",
        minHeight: { xs: 320, sm: 420 },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        backgroundColor: "#0b0f19",
        backgroundImage: movie
          ? [
              "linear-gradient(180deg, rgba(11,15,25,.25) 0%, rgba(11,15,25,.65) 70%, rgba(11,15,25,.95) 100%)",
              "linear-gradient(90deg, rgba(11,15,25,.92) 0%, rgba(11,15,25,.4) 55%, transparent 100%)",
              `url(${BACKDROP_URL}${movie.backdrop_path})`,
            ].join(", ")
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
      }}
    >
      <Container sx={{ py: { xs: 4, sm: 6 } }}>
        {movie === undefined ? (
          <Box maxWidth={560}>
            <Skeleton variant="text" width={140} height={28} sx={{ bgcolor: "rgba(255,255,255,.12)" }} />
            <Skeleton variant="text" width="90%" height={56} sx={{ bgcolor: "rgba(255,255,255,.12)" }} />
            <Skeleton variant="text" width="60%" height={24} sx={{ bgcolor: "rgba(255,255,255,.12)" }} />
          </Box>
        ) : (
          <Box maxWidth={560}>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#fb923c !important" }} />}
              label="#1 Trending This Week"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,.14)", color: "#fff", fontWeight: 600, mb: 1.5 }}
            />
            <Typography variant="h3" fontWeight={800} lineHeight={1.15} sx={{ fontSize: { xs: "1.9rem", sm: "2.6rem" } }}>
              {movie.title}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1.5} mb={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StarIcon fontSize="small" sx={{ color: "#fbbf24" }} />
                <Typography fontWeight={600}>{movie.vote_average?.toFixed(1)}</Typography>
              </Stack>
              <Typography sx={{ opacity: 0.75 }}>{movie.release_date?.slice(0, 4)}</Typography>
            </Stack>
            <Typography
              sx={{
                opacity: 0.85,
                mb: 3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.overview}
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to={`/movie/${movie.id}`}
                startIcon={<PlayArrowIcon />}
                sx={{ px: 3 }}
              >
                View details
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
