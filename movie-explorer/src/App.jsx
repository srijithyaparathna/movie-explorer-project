import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import AuthDialog from "./components/AuthDialog";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

// TMDb's API terms require this attribution
const Footer = () => (
  <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3, mt: "auto" }}>
    <Container>
      <Typography variant="caption" color="text.secondary">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Typography>
    </Container>
  </Box>
);

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box component="main" flexGrow={1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
        <AuthDialog />
      </BrowserRouter>
    </AppProvider>
  );
}
