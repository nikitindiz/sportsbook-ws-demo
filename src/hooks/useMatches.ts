import { useContext } from "react";
import { MatchesContext } from "../contexts/MatchesContext";

export function useMatches() {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
}
