import { useEffect, useState } from "react";
import { AutoSizer, List } from "react-virtualized";

import "./App.css";

import { MatchesProvider } from "./contexts/MatchesContext";
import { SelectedOddsProvider } from "./contexts/SelectedOddsContext";
import { useMatches } from "./hooks/useMatches";
import { rowRenderer } from "./components/MatchRow";

function MatchesList() {
  const { matchesIds, isConnected, error } = useMatches();

  const [scrollTop, setScrollTop] = useState(
    +(sessionStorage.getItem("scrollTop") || "0")
  );

  useEffect(() => {
    sessionStorage.setItem("scrollTop", scrollTop.toString());
  }, [scrollTop]);

  const rowHeight = 240;

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
                rowHeight={rowHeight}
                rowRenderer={rowRenderer}
                overscanRowCount={10}
                scrollTop={scrollTop}
                onScroll={({ scrollTop }) => {
                  setScrollTop(scrollTop);
                }}
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

const wsUrl = import.meta.env.PROD
  ? "wss://ws-test.nikitin-alex.com"
  : "ws://localhost:3000";

function App() {
  return (
    <MatchesProvider wsUrl={wsUrl}>
      <SelectedOddsProvider>
        <MatchesList />
      </SelectedOddsProvider>
    </MatchesProvider>
  );
}

export default App;
