import { useState, useEffect } from "react";

// useState that persists to localStorage under `key`
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked (e.g. private mode) - keep working in memory
    }
  }, [key, value]);
  return [value, setValue];
}
