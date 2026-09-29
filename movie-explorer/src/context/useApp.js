import { createContext, useContext } from "react";

// Kept separate from AppProvider so Fast Refresh works (component files export only components)
export const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
};
