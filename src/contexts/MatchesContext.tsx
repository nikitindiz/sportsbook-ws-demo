import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

export interface Match {
  id: number;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  sport: string;
  start_time: string;
  status: string;
  home_win_probability: number;
  betting_1x2_home_win: number;
  betting_1x2_draw: number;
  betting_1x2_away_win: number;
  betting_double_chance_home_win_draw: number;
  betting_double_chance_away_win_draw: number;
  betting_double_chance_home_win_away_win: number;
  betting_over_under_2_5_goals_over: number;
  betting_over_under_2_5_goals_under: number;
  created_at: string;
  updated_at: string;
}

interface MatchesContextType {
  matchesIds: number[];
  matchesMap: Map<number, Match>;
  isConnected: boolean;
  error: string | null;
}

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export function useMatches() {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
}

interface MatchesProviderProps {
  children: ReactNode;
  wsUrl?: string;
}

export function MatchesProvider({
  children,
  wsUrl = "ws://localhost:3000",
}: MatchesProviderProps) {
  const [matchesIds, setMatchesIds] = useState<number[]>([]);
  const [matchesMap, setMatchesMap] = useState<Map<number, Match>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // Connection opened
    ws.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
      setError(null);
    });

    // Listen for messages
    ws.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data.data.data)) {
          setMatchesMap((prevMap) => {
            const newMap = new Map(prevMap);
            data.data.data.forEach((match: Match) => {
              newMap.set(match.id, match);
            });

            const deletedIds: Record<string, boolean> = {};

            // Remove matches with status "finished" from the map
            Array.from(newMap.keys()).forEach((id) => {
              const match = newMap.get(id);
              if (match && match.status === "finished") {
                newMap.delete(id);
                deletedIds[id] = true;
              }
            });

            setMatchesIds((prevIds) => {
              const newIds = data.data.data
                .filter((match: Match) => match.status !== "finished")
                .map((match: Match) => match.id);
              const updatedIds = new Set([
                ...prevIds.filter((id) => !deletedIds[id]),
                ...newIds,
              ]);
              return Array.from(updatedIds);
            });

            return newMap;
          });
        }
      } catch (err) {
        console.error("Error parsing WebSocket data:", err);
      }
    });

    // Handle disconnection
    ws.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Clean up on unmount
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, [wsUrl]);

  return (
    <MatchesContext.Provider
      value={{ matchesIds, matchesMap, isConnected, error }}
    >
      {children}
    </MatchesContext.Provider>
  );
}
