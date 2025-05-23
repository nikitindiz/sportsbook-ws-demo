import React, { type ButtonHTMLAttributes } from "react";

interface BettingOddsButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  odds: string | number;
  active?: boolean;
  disabled?: boolean;
}

const BettingOddsButton: React.FC<BettingOddsButtonProps> = ({
  odds,
  className,
  active,
  disabled,
  children,
  ...restProps
}) => {
  return (
    <button
      className={`betting-odds-button ${active ? "active" : ""} ${
        disabled ? "disabled" : ""
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
