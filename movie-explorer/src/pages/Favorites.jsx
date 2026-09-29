import { Container, Typography, Grid, Box, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useApp } from "../context/useApp";

// Centered message with an icon and a call to action
const EmptyState = ({ icon, title, text, action }) => (
  <Box textAlign="center" py={10} px={2}>
    <Box sx={{ width: 72, height: 72, mx: "auto", mb: 2, borderRadius: "50%", display: "grid",
               placeItems: "center", bgcolor: "action.hover", color: "text.secondary" }}>
      {icon}
    </Box>
    <Typography variant="h6" fontWeight={600}>{title}</Typography>
    <Typography color="text.secondary" mt={1} mb={3}>{text}</Typography>
    {action}
  </Box>
);

export default function Favorites() {
  const { user, favorites, openAuth } = useApp();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        My Favorites{user && favorites.length > 0 && ` (${favorites.length})`}
      </Typography>

      {!user ? (
        <EmptyState
          icon={<LockOutlinedIcon fontSize="large" />}
          title="Sign in to see your favorites"
          text="Your saved movies are tied to your account."
          action={<Button variant="contained" onClick={() => openAuth("signin")}>Sign in</Button>}
        />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<FavoriteBorderIcon fontSize="large" />}
          title="No favorites yet"
          text="Tap the heart on any movie to save it here."
          action={<Button variant="contained" component={Link} to="/">Browse movies</Button>}
        />
      ) : (
        <Grid container spacing={2}>
          {favorites.map((m) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={m.id}><MovieCard movie={m} /></Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
