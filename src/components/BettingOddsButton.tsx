import React, {
  type ButtonHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from "react";

import "./BettingOddsButton.css"; // Assuming you have a CSS file for styles

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
  children,
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

  return (
    <button
      className={`betting-odds-button ${active ? "active" : ""} ${
        disabled ? "disabled" : ""
      } ${changeStatus === "increased" ? "odds-increased" : ""} ${
        changeStatus === "decreased" ? "odds-decreased" : ""
      } ${className || ""}`}
      disabled={disabled}
      {...restProps}
    >
      <span className="odds-value">{odds}</span>
      {children && <div className="additional-content">{children}</div>}
    </button>
  );
};

export default BettingOddsButton;
