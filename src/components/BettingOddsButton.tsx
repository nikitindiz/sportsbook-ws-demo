import React, {
  type ButtonHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from "react";
import cn from "classnames";

import styles from "./BettingOddsButton.module.scss";

interface BettingOddsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  odds: number;
  active?: boolean;
  disabled?: boolean;
}

type OddsChangeStatus = "increased" | "decreased" | "none";

const BettingOddsButton: React.FC<BettingOddsButtonProps> = ({
  odds,
  className,
  active,
  disabled,
  ...restProps
}) => {
  const [changeStatus, setChangeStatus] = useState<OddsChangeStatus>("none");
  const prevOdds = useRef<number>(odds);

  useEffect(() => {
    if (odds !== prevOdds.current) {
      // Determine if odds have increased or decreased
      const newStatus = odds > prevOdds.current ? "increased" : "decreased";
      setChangeStatus(newStatus);

      // Store the current odds as previous for next comparison
      prevOdds.current = odds;

      // Reset the change status after 3 seconds
      const timerId = setTimeout(() => {
        setChangeStatus("none");
      }, 3000);

      // Clean up the timeout when component unmounts or when odds change again
      return () => clearTimeout(timerId);
    }
  }, [odds]);

  delete restProps["children"];

  return (
    <button
      className={cn(className, {
        [styles.button]: true,
        [styles.button_active]: active,
        [styles.button_disabled]: disabled,
        [styles.button_oddsIncreased]: changeStatus === "increased",
        [styles.button_oddsDecreased]: changeStatus === "decreased",
      })}
      disabled={disabled}
      {...restProps}
    >
      <span className="odds-value">{odds}</span>
    </button>
  );
};

export default BettingOddsButton;
