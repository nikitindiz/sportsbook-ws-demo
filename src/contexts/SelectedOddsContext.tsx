import { createContext, useContext, useState, useEffect } from "react";

interface SelectedOddsContextType {
  selectedOdds: Map<number, string>;
  selectOdds: (matchId: number, oddsType: string) => void;
  deselectOdds: (matchId: number, oddsType: string) => void;
}

const SelectedOddsContext = createContext<SelectedOddsContextType | undefined>(
  undefined
);

export function useSelectedOdds() {
  const context = useContext(SelectedOddsContext);
  if (!context) {
    throw new Error(
      "useSelectedOdds must be used within a SelectedOddsProvider"
    );
  }
  return context;
}

export function SelectedOddsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedOdds, setSelectedOdds] = useState<Map<number, string>>(() => {
    // Initialize from localStorage on component mount
    const savedOdds = localStorage.getItem("selectedOdds");
    if (savedOdds) {
      try {
        // Convert saved JSON back to Map
        const parsedOdds = JSON.parse(savedOdds);
        return new Map(
          Object.entries(parsedOdds).map(([id, odds]) => [
            Number(id),
            odds as string,
          ])
        );
      } catch (error) {
        console.error("Failed to parse selectedOdds from localStorage:", error);
        return new Map();
      }
    }
    return new Map();
  });

  // Save to localStorage whenever selectedOdds changes
  useEffect(() => {
    const mapToObject = Object.fromEntries(selectedOdds);
    localStorage.setItem("selectedOdds", JSON.stringify(mapToObject));
  }, [selectedOdds]);

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "selectedOdds" && event.newValue) {
        try {
          const parsedOdds = JSON.parse(event.newValue);
          const newMap = new Map(
            Object.entries(parsedOdds).map(([id, odds]) => [
              Number(id),
              odds as string,
            ])
          );
          setSelectedOdds(newMap);
        } catch (error) {
          console.error("Failed to sync selectedOdds from other tabs:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const selectOdds = (matchId: number, oddsType: string) => {
    setSelectedOdds((prev) => new Map(prev).set(matchId, oddsType));
  };

  const deselectOdds = (matchId: number) => {
    setSelectedOdds((prev) => {
      const newMap = new Map(prev);
      newMap.delete(matchId);
      return newMap;
    });
  };

  return (
    <SelectedOddsContext.Provider
      value={{ selectedOdds, selectOdds, deselectOdds }}
    >
      {children}
    </SelectedOddsContext.Provider>
  );
}
