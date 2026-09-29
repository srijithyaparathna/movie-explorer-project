import { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import useDebounce from "../hooks/useDebounce";

export default function SearchBar({ initialValue = "", onSearch }) {
  const [text, setText] = useState(initialValue);
  const debounced = useDebounce(text, 500);

  // onSearch must be stable (useCallback in the parent)
  useEffect(() => { onSearch(debounced.trim()); }, [debounced, onSearch]);

  return (
    <TextField
      fullWidth
      placeholder="Search for a movie..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
    />
  );
}