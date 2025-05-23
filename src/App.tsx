import { AutoSizer, List, type ListRowProps } from "react-virtualized";
import { useMatches, MatchesProvider } from "./contexts/MatchesContext";
import "./App.css";
import { useEffect, useState, type CSSProperties } from "react";
import BettingOddsButton from "./components/BettingOddsButton";

const roundToTwoDecimals = (num = 0) => {
  return Math.round(num * 100) / 100;
};

const Row: React.FC<{ index: number; style: CSSProperties }> = ({
  style,
  index,
}) => {
  const { matchesMap, matchesIds } = useMatches();
  const match = matchesMap.get(matchesIds[index]);

  if (!match) {
    return null; // or a loading spinner
  }

  return (
    <div style={style} className="match-row">
      <div className="match-header">
        <span className="match-sport">
          <img src={`${match.sport}-icon.svg`} alt={match.sport} />
          &nbsp;{match.sport}
        </span>
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
          <BettingOddsButton
            odds={roundToTwoDecimals(match.betting_1x2_home_win)}
          />
          <BettingOddsButton
            odds={roundToTwoDecimals(match.betting_1x2_draw)}
          />
          <BettingOddsButton
            odds={roundToTwoDecimals(match.betting_1x2_away_win)}
          />
        </div>
        <div className="odds-group">
          <span className="odds-label">Over/Under 2.5:</span>
          <BettingOddsButton
            odds={roundToTwoDecimals(match.betting_over_under_2_5_goals_over)}
          />
          <BettingOddsButton
            odds={roundToTwoDecimals(match.betting_over_under_2_5_goals_under)}
          />
        </div>
      </div>
    </div>
  );
};

const rowRenderer = ({ key, ...props }: ListRowProps) => (
  <Row key={key} {...props} />
);

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

function App() {
  return (
    <MatchesProvider>
      <MatchesList />
    </MatchesProvider>
  );
}

export default App;
