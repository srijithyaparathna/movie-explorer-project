import { useEffect, useState } from "react";
import { Box, TextField, MenuItem, InputAdornment, Chip } from "@mui/material";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { getGenres } from "../api/tmdb";

export default function GenreFilter({ filters, onChange }) {
  const [genres, setGenres] = useState([]);
  useEffect(() => { getGenres().then(setGenres).catch(() => {}); }, []);

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Box display="flex" gap={1.5} flexWrap="wrap" alignItems="center">
      <TextField
        select
        label="Genre"
        value={filters.genre}
        onChange={set("genre")}
        size="small"
        sx={{ minWidth: 160 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><TheatersOutlinedIcon fontSize="small" /></InputAdornment> } }}
      >
        <MenuItem value="">All genres</MenuItem>
        {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
      </TextField>
      <TextField
        label="Year"
        type="number"
        value={filters.year}
        onChange={set("year")}
        size="small"
        sx={{ width: 130 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><EventOutlinedIcon fontSize="small" /></InputAdornment> } }}
      />
      <TextField
        select
        label="Min rating"
        value={filters.rating}
        onChange={set("rating")}
        size="small"
        sx={{ minWidth: 140 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><StarBorderIcon fontSize="small" /></InputAdornment> } }}
      >
        <MenuItem value="">Any rating</MenuItem>
        {[5, 6, 7, 8, 9].map((r) => <MenuItem key={r} value={r}>{r}+ stars</MenuItem>)}
      </TextField>
      {activeCount > 0 && (
        <Chip
          label="Clear filters"
          size="small"
          onDelete={() => onChange({ genre: "", year: "", rating: "" })}
          onClick={() => onChange({ genre: "", year: "", rating: "" })}
          variant="outlined"
        />
      )}
    </Box>
  );
}
