import { useMemo, useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import useLocalStorage from "../hooks/useLocalStorage";
import { AppContext } from "./useApp";
import { hashPassword, newSalt } from "../utils/password";

// Only the fields MovieCard needs, so favorites stay small in localStorage
const toFavorite = ({ id, title, poster_path, release_date, vote_average }) => ({
  id, title, poster_path, release_date, vote_average,
});

const buildTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === "dark" ? "#f43f5e" : "#e11d48" },
      secondary: { main: "#f59e0b" },
      ...(mode === "dark" && { background: { default: "#0b0f19", paper: "#121826" } }),
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      button: { textTransform: "none", fontWeight: 600 },
    },
  });

export function AppProvider({ children }) {
  const [mode, setMode] = useLocalStorage("theme", "light");
  const [accounts, setAccounts] = useLocalStorage("accounts", {});
  const [session, setSession] = useLocalStorage("user", null);
  // Favorites per account: { [lower-cased username]: Movie[] }
  const [favoritesByUser, setFavoritesByUser] = useLocalStorage("favoritesByUser", {});
  const [lastSearch, setLastSearch] = useLocalStorage("lastSearch", "");
  const [authDialog, setAuthDialog] = useState(null); // null | "signin" | "register"

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  // A session only counts if its account still exists (drops stale/legacy sessions)
  const userKey = session?.username?.toLowerCase();
  const user = userKey && accounts[userKey] ? session : null;

  const openAuth = (view = "signin") => setAuthDialog(view);
  const closeAuth = () => setAuthDialog(null);

  // Local accounts keyed by lower-cased username; passwords stored as salted hashes.
  // Both return { ok, error } so the form can show a message.
  const register = async (username, password) => {
    const name = username.trim();
    const key = name.toLowerCase();
    if (accounts[key]) return { ok: false, error: "That username is already taken." };
    const salt = newSalt();
    const passwordHash = await hashPassword(password, salt);
    setAccounts((prev) => ({ ...prev, [key]: { username: name, salt, passwordHash, createdAt: Date.now() } }));
    setSession({ username: name });
    return { ok: true };
  };

  const login = async (username, password) => {
    const account = accounts[username.trim().toLowerCase()];
    const valid = account && (await hashPassword(password, account.salt)) === account.passwordHash;
    if (!valid) return { ok: false, error: "Incorrect username or password." };
    setSession({ username: account.username });
    return { ok: true };
  };

  const logout = () => setSession(null);

  const favorites = useMemo(() => (user ? favoritesByUser[userKey] || [] : []), [user, favoritesByUser, userKey]);
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  // Saving favorites needs an account, so signed-out users get the sign-in dialog
  const toggleFavorite = (movie) => {
    if (!user) return openAuth("signin");
    setFavoritesByUser((prev) => {
      const list = prev[userKey] || [];
      const next = list.some((m) => m.id === movie.id)
        ? list.filter((m) => m.id !== movie.id)
        : [...list, toFavorite(movie)];
      return { ...prev, [userKey]: next };
    });
  };

  return (
    <AppContext.Provider
      value={{ mode, toggleMode, user, login, register, logout, authDialog, openAuth, closeAuth,
               favorites, isFavorite, toggleFavorite, lastSearch, setLastSearch }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
}
