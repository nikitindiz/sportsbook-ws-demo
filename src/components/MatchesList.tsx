import { useState, useEffect } from "react";
import { AutoSizer, List } from "react-virtualized";

import styles from "./MatchesList.module.scss";

import { useMatches } from "../hooks/useMatches";
import { rowRenderer } from "../components/MatchRow";

export const MatchesList: React.FC = () => {
  const { matchesIds, isConnected, error } = useMatches();

  const [scrollTop, setScrollTop] = useState(
    +(sessionStorage.getItem("scrollTop") || "0")
  );

  useEffect(() => {
    sessionStorage.setItem("scrollTop", scrollTop.toString());
  }, [scrollTop]);

  const rowHeight = 240;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Live Sports Matches</h1>

        <div className={styles.connectionStatus}>
          Status:{" "}
          {isConnected ? (
            <span className={styles.connected}>Connected</span>
          ) : (
            <span className={styles.disconnected}>Disconnected</span>
          )}
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      </header>

      <div className={styles.matchesContainer}>
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
          <div className={styles.noMatches}>
            {isConnected
              ? "Waiting for matches data..."
              : "Connect to view matches"}
          </div>
        )}
      </div>
    </div>
  );
};
