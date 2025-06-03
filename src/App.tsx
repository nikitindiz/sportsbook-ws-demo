import "./App.css";

import { MatchesList } from "./components/MatchesList";
import { MatchesProvider } from "./contexts/MatchesContext";
import { SelectedOddsProvider } from "./contexts/SelectedOddsContext";

const wsUrl = import.meta.env.PROD
  ? "wss://sportsbook-demo.nikitin-alex.com"
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
