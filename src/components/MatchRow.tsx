import type { CSSProperties } from "react";
import type { ListRowProps } from "react-virtualized";

import styles from "./MatchRow.module.scss";

import BettingOddsButton from "./BettingOddsButton";
import { useMatches } from "../hooks/useMatches";
import { useSelectedOdds } from "../contexts/SelectedOddsContext";
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
    <div style={style} className={styles.matchRow}>
      <div className={styles.matchHeader}>
        <span className={styles.matchSport}>
          {iconsMap[match.sport as keyof typeof iconsMap] || null}
          {match.sport}
        </span>
        <span className={styles.matchStatus}>{match.status}</span>
        <span className={styles.matchTime}>
          {new Date(match.start_time).toLocaleString()}
        </span>
      </div>

      <div className={styles.matchTeams}>
        <span>{match.team1_name}</span>
        <span className={styles.matchScore}>
          {match.team1_score} - {match.team2_score}
        </span>
        <span>{match.team2_name}</span>
      </div>

      <div className={styles.matchOdds}>
        <div className={styles.oddsGroup}>
          <span className={styles.oddsLabel}>1X2:</span>

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

        <div className={styles.oddsGroup}>
          <span className={styles.oddsLabel}>Over/Under 2.5:</span>
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
