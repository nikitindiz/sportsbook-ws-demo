import type { CSSProperties } from "react";
import BettingOddsButton from "./BettingOddsButton";
import { useMatches } from "../hooks/useMatches";
import { useSelectedOdds } from "../contexts/SelectedOddsContext";
import type { ListRowProps } from "react-virtualized";
import { IconFootball } from "./IconFootball";
import { IconBasketball } from "./IconBasketball";
import { IconTennis } from "./IconTennis";
import { IconBaseball } from "./IconBaseball";
import { IconHockey } from "./IconHockey";

const iconsMap = {
  football: <IconFootball />,
  basketball: <IconBasketball />,
  tennis: <IconTennis />,
  baseball: <IconBaseball />,
  hockey: <IconHockey />,
};

const roundToTwoDecimals = (num = 0) => {
  return Math.round(num * 100) / 100;
};

export const MatchRow: React.FC<{ index: number; style: CSSProperties }> = ({
  style,
  index,
}) => {
  const { matchesMap, matchesIds } = useMatches();
  const match = matchesMap.get(matchesIds[index]);
  const { selectedOdds, selectOdds } = useSelectedOdds();

  if (!match) {
    return null;
  }

  return (
    <div style={style} className="match-row">
      <div className="match-header">
        <span className="match-sport">
          {iconsMap[match.sport as keyof typeof iconsMap] || null}
          {/* <img src={`/${match.sport}-icon.svg`} alt={match.sport} /> */}
          &nbsp;{match.sport}
        </span>
        <span className="match-status">{match.status}</span>
        <span className="match-time">
          {new Date(match.start_time).toLocaleString()}
        </span>
      </div>
      <div className="match-teams">
        <span>{match.team1_name}</span>
        <span className="match-score">
          {match.team1_score} - {match.team2_score}
        </span>
        <span>{match.team2_name}</span>
      </div>
      <div className="match-odds">
        <div className="odds-group">
          <span className="odds-label">1X2:</span>
          <BettingOddsButton
            active={selectedOdds.get(match.id) === "betting_1x2_home_win"}
            onClick={() => selectOdds(match.id, "betting_1x2_home_win")}
            odds={roundToTwoDecimals(match.betting_1x2_home_win)}
          />
          <BettingOddsButton
            active={selectedOdds.get(match.id) === "betting_1x2_draw"}
            onClick={() => selectOdds(match.id, "betting_1x2_draw")}
            odds={roundToTwoDecimals(match.betting_1x2_draw)}
          />
          <BettingOddsButton
            active={selectedOdds.get(match.id) === "betting_1x2_away_win"}
            onClick={() => selectOdds(match.id, "betting_1x2_away_win")}
            odds={roundToTwoDecimals(match.betting_1x2_away_win)}
          />
        </div>
        <div className="odds-group">
          <span className="odds-label">Over/Under 2.5:</span>
          <BettingOddsButton
            active={
              selectedOdds.get(match.id) === "betting_over_under_2_5_goals_over"
            }
            onClick={() =>
              selectOdds(match.id, "betting_over_under_2_5_goals_over")
            }
            odds={roundToTwoDecimals(match.betting_over_under_2_5_goals_over)}
          />
          <BettingOddsButton
            active={
              selectedOdds.get(match.id) ===
              "betting_over_under_2_5_goals_under"
            }
            onClick={() =>
              selectOdds(match.id, "betting_over_under_2_5_goals_under")
            }
            odds={roundToTwoDecimals(match.betting_over_under_2_5_goals_under)}
          />
        </div>
      </div>
    </div>
  );
};

export const rowRenderer = ({ key, ...props }: ListRowProps) => (
  <MatchRow key={key} {...props} />
);
