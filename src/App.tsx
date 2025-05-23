import { useState, useEffect, useRef } from "react";
import { AutoSizer, List, type ListRowProps } from "react-virtualized";
import "./App.css";

interface Match {
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

function App() {
  const [matchesIds, setMatchesIds] = useState<number[]>([]);
  const [matchesMap, setMatchesMap] = useState<Map<number, Match>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:3000");
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

    // Handle errors
    // ws.addEventListener("error", (event) => {
    //   console.error("WebSocket error:", event);
    //   setError("Error connecting to WebSocket server");
    // });

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
  }, []);

  // Row renderer for virtualized list
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    const match = matchesMap.get(matchesIds[index]);
    if (!match) {
      return null; // or a loading spinner
    }

    return (
      <div key={key} style={style} className="match-row">
        <div className="match-header">
          <span className="match-sport">{match.sport}</span>
          <span className="match-status">{match.status}</span>
          <span className="match-time">
            {new Date(match.start_time).toLocaleString()}
          </span>
        </div>
        <div className="match-teams">
          <span>{match.team1_id}</span>
          <span className="match-score">
            {match.team1_score} - {match.team2_score}
          </span>
          <span>{match.team2_id}</span>
        </div>
        <div className="match-odds">
          <div className="odds-group">
            <span className="odds-label">1X2:</span>
            <span>{match.betting_1x2_home_win}</span>
            <span>{match.betting_1x2_draw}</span>
            <span>{match.betting_1x2_away_win}</span>
          </div>
          <div className="odds-group">
            <span className="odds-label">Over/Under 2.5:</span>
            <span>{match.betting_over_under_2_5_goals_over}</span>
            <span>{match.betting_over_under_2_5_goals_under}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Live Sports Matches</h1>
        <div className="connection-status">
          Status:{" "}
          {isConnected ? (
            <span className="connected">Connected</span>
          ) : (
            <span className="disconnected">Disconnected</span>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
      </header>

      <div className="matches-container">
        {matchesIds.length > 0 ? (
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={matchesIds.length}
                rowHeight={120}
                rowRenderer={rowRenderer}
                overscanRowCount={10}
              />
            )}
          </AutoSizer>
        ) : (
          <div className="no-matches">
            {isConnected
              ? "Waiting for matches data..."
              : "Connect to view matches"}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
