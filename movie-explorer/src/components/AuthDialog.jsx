import { useState } from "react";
import {
  Dialog, DialogContent, Box, TextField, Button, Typography, Alert, InputAdornment,
  IconButton, CircularProgress, Link, Stack, useMediaQuery, useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useApp } from "../context/useApp";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const MIN_PASSWORD = 6;

// Returns field-level error messages for the current form values
function validate({ username, password, confirm }, isRegister) {
  const errors = {};
  if (!username.trim()) errors.username = "Enter your username.";
  else if (isRegister && !USERNAME_RE.test(username.trim()))
    errors.username = "3–20 characters: letters, numbers or underscores.";
  if (!password) errors.password = "Enter your password.";
  else if (isRegister && password.length < MIN_PASSWORD)
    errors.password = `Use at least ${MIN_PASSWORD} characters.`;
  if (isRegister && confirm !== password) errors.confirm = "Passwords don't match.";
  return errors;
}

// Sign in / create account form. Mounted fresh each time the dialog opens.
function AuthForm({ initialView, onDone }) {
  const { login, register } = useApp();
  const [isRegister, setIsRegister] = useState(initialView === "register");
  const [values, setValues] = useState({ username: "", password: "", confirm: "" });
  const [touched, setTouched] = useState(false); // show field errors only after a submit attempt
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const errors = touched ? validate(values, isRegister) : {};

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setFormError("");
  };

  const switchView = () => {
    setIsRegister((r) => !r);
    setValues((v) => ({ ...v, password: "", confirm: "" }));
    setTouched(false);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(validate(values, isRegister)).length) return;
    setSubmitting(true);
    const { ok, error } = await (isRegister ? register : login)(values.username, values.password);
    if (ok) return onDone();
    setFormError(error);
    setSubmitting(false);
  };

  const lockIcon = <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>;
  const visibilityToggle = (
    <InputAdornment position="end">
      <IconButton
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={() => setShowPassword((s) => !s)}
        edge="end"
      >
        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "grid", placeItems: "center",
                   bgcolor: "primary.main", color: "primary.contrastText" }}>
          <MovieFilterIcon />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} id="auth-dialog-title">
            {isRegister ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isRegister ? "Save favorites and pick up where you left off." : "Sign in to access your favorites."}
          </Typography>
        </Box>
      </Stack>

      {formError && <Alert severity="error" sx={{ mb: 1 }}>{formError}</Alert>}

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        autoComplete="username"
        autoFocus
        value={values.username}
        onChange={set("username")}
        error={Boolean(errors.username)}
        helperText={errors.username || (isRegister ? "3–20 characters: letters, numbers or underscores." : " ")}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonOutlineIcon /></InputAdornment> } }}
      />
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        margin="normal"
        autoComplete={isRegister ? "new-password" : "current-password"}
        value={values.password}
        onChange={set("password")}
        error={Boolean(errors.password)}
        helperText={errors.password || (isRegister ? `At least ${MIN_PASSWORD} characters.` : " ")}
        slotProps={{ input: { startAdornment: lockIcon, endAdornment: visibilityToggle } }}
      />
      {isRegister && (
        <TextField
          fullWidth
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          autoComplete="new-password"
          value={values.confirm}
          onChange={set("confirm")}
          error={Boolean(errors.confirm)}
          helperText={errors.confirm || " "}
          slotProps={{ input: { startAdornment: lockIcon } }}
        />
      )}

      <Button fullWidth type="submit" variant="contained" size="large" disabled={submitting} sx={{ mt: 2, py: 1.4 }}>
        {submitting ? <CircularProgress size={24} color="inherit" /> : isRegister ? "Create account" : "Sign in"}
      </Button>

      <Typography align="center" variant="body2" color="text.secondary" mt={3}>
        {isRegister ? "Already have an account? " : "New to Movie Explorer? "}
        <Link component="button" type="button" onClick={switchView} fontWeight={600} underline="hover"
              sx={{ verticalAlign: "baseline" }}>
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </Typography>
    </Box>
  );
}

// Modal opened from the navbar (or when a signed-out user tries to save a favorite)
export default function AuthDialog() {
  const { authDialog, closeAuth } = useApp();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // Remember the last view so the content doesn't vanish during the close animation
  const [lastView, setLastView] = useState("signin");
  const [formKey, setFormKey] = useState(0);
  if (authDialog && authDialog !== lastView) setLastView(authDialog);

  return (
    <Dialog
      open={Boolean(authDialog)}
      onClose={closeAuth}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xs"
      aria-labelledby="auth-dialog-title"
      TransitionProps={{ onEnter: () => setFormKey((k) => k + 1) }} // fresh, empty form on every open
    >
      <IconButton aria-label="Close" onClick={closeAuth} sx={{ position: "absolute", top: 8, right: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 6, sm: 5 } }}>
        <AuthForm key={formKey} initialView={authDialog || lastView} onDone={closeAuth} />
      </DialogContent>
    </Dialog>
  );
}
