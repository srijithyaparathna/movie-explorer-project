import { useState } from "react";
import { NavLink, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Container, Typography, Button, IconButton, Box, Avatar, Tooltip, Badge,
  Menu, MenuItem, ListItemIcon, Divider, alpha,
} from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useApp } from "../context/useApp";

// Nav link that highlights itself when its route is active; icon-only on small screens
function NavItem({ to, icon, label, badge = 0 }) {
  return (
    <Button
      component={NavLink}
      to={to}
      end
      color="inherit"
      aria-label={label}
      sx={{
        minWidth: 0,
        px: { xs: 1, sm: 1.5 },
        color: "text.secondary",
        "&.active": { color: "text.primary", bgcolor: "action.selected" },
      }}
    >
      <Badge badgeContent={badge} color="primary" max={99}>{icon}</Badge>
      <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, ml: 1 }}>{label}</Box>
    </Button>
  );
}

export default function Navbar() {
  const { mode, toggleMode, user, logout, openAuth, favorites } = useApp();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        bgcolor: (t) => alpha(t.palette.background.default, 0.8),
        backdropFilter: "blur(12px)",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ gap: { xs: 0.5, sm: 1 } }}>
          {/* Brand */}
          <Box component={RouterLink} to="/" aria-label="Movie Explorer home"
               sx={{ display: "flex", alignItems: "center", gap: 1.25, mr: "auto", color: "inherit", textDecoration: "none" }}>
            <Box sx={{ width: 34, height: 34, borderRadius: 2, display: "grid", placeItems: "center",
                       bgcolor: "primary.main", color: "primary.contrastText" }}>
              <MovieFilterIcon fontSize="small" />
            </Box>
            <Typography variant="h6" fontWeight={700} noWrap sx={{ display: { xs: "none", sm: "block" } }}>
              Movie Explorer
            </Typography>
          </Box>

          <NavItem to="/" icon={<HomeOutlinedIcon />} label="Home" />
          <NavItem to="/favorites" icon={<FavoriteBorderIcon />} label="Favorites" badge={favorites.length} />

          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton onClick={toggleMode} aria-label="Toggle color mode" sx={{ color: "text.secondary" }}>
              {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title="Account">
                <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu" sx={{ p: 0.5 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 15, fontWeight: 600 }}>
                    {user.username[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 200 } } }}
              >
                <Box px={2} py={1}>
                  <Typography variant="caption" color="text.secondary">Signed in as</Typography>
                  <Typography fontWeight={600} noWrap>{user.username}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { closeMenu(); navigate("/favorites"); }}>
                  <ListItemIcon><FavoriteBorderIcon fontSize="small" /></ListItemIcon>
                  My favorites
                </MenuItem>
                <MenuItem onClick={() => { closeMenu(); logout(); }}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  Sign out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" onClick={() => openAuth("signin")} sx={{ ml: 0.5, whiteSpace: "nowrap" }}>
              Sign in
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
