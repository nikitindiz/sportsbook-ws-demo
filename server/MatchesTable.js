// Helper functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function getRandomElement(arr) {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTeamNames(count = 20000) {
  const adjectives = [
    "Mighty",
    "Swift",
    "Brave",
    "Bold",
    "Wild",
    "Dark",
    "Bright",
    "Strong",
    "Fast",
    "Sharp",
    "Fierce",
    "Noble",
    "Royal",
    "Elite",
    "Prime",
    "Ultra",
    "Mega",
    "Super",
    "Alpha",
    "Beta",
    "Cosmic",
    "Stellar",
    "Solar",
    "Lunar",
    "Storm",
    "Thunder",
    "Lightning",
    "Fire",
    "Ice",
    "Steel",
    "Iron",
    "Golden",
    "Silver",
    "Crystal",
    "Diamond",
    "Crimson",
    "Scarlet",
    "Azure",
    "Emerald",
    "Jade",
    "Shadow",
    "Ghost",
    "Phantom",
    "Spirit",
    "Mystic",
    "Magic",
    "Ancient",
    "Eternal",
    "Infinite",
    "Supreme",
    "Legendary",
    "Epic",
    "Heroic",
    "Valiant",
    "Fearless",
    "Unstoppable",
    "Invincible",
    "Unbeatable",
    "Triumphant",
    "Victorious",
  ];

  const nouns = [
    "Eagles",
    "Hawks",
    "Lions",
    "Tigers",
    "Bears",
    "Wolves",
    "Sharks",
    "Panthers",
    "Falcons",
    "Ravens",
    "Dragons",
    "Phoenix",
    "Griffins",
    "Titans",
    "Giants",
    "Demons",
    "Angels",
    "Knights",
    "Warriors",
    "Gladiators",
    "Spartans",
    "Vikings",
    "Samurai",
    "Ninjas",
    "Crusaders",
    "Guardians",
    "Defenders",
    "Protectors",
    "Hunters",
    "Rangers",
    "Scouts",
    "Pilots",
    "Raiders",
    "Bandits",
    "Pirates",
    "Corsairs",
    "Reapers",
    "Slayers",
    "Destroyers",
    "Conquerors",
    "Cobras",
    "Vipers",
    "Serpents",
    "Scorpions",
    "Spiders",
    "Hornets",
    "Wasps",
    "Bees",
    "Ants",
    "Beetles",
    "Rhinos",
    "Elephants",
    "Buffalos",
    "Stallions",
    "Mustangs",
    "Broncos",
    "Bulls",
    "Rams",
    "Stags",
    "Bucks",
  ];

  const postfixes = [
    ["Force", "Squad", "Team", "Crew", "Unit", "Guild", "Club", "Society"],
    [
      "Legion",
      "Division",
      "Brigade",
      "Battalion",
      "Regiment",
      "Corps",
      "Guard",
      "Army",
    ],
    ["Elite", "Prime", "Pro", "Max", "Plus", "Ultra", "Super", "Mega"],
    [
      "Alliance",
      "Union",
      "Coalition",
      "Federation",
      "League",
      "Order",
      "Brotherhood",
      "Syndicate",
    ],
    [
      "York",
      "Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Dallas",
      "Miami",
      "Atlanta",
    ],
    [
      "London",
      "Paris",
      "Berlin",
      "Rome",
      "Madrid",
      "Vienna",
      "Prague",
      "Warsaw",
    ],
    [
      "Tokyo",
      "Seoul",
      "Bangkok",
      "Singapore",
      "Mumbai",
      "Shanghai",
      "Beijing",
      "Osaka",
    ],
    [
      "North",
      "South",
      "East",
      "West",
      "Central",
      "United",
      "Global",
      "International",
    ],
  ];

  const teams = new Set();

  for (let adj of adjectives) {
    for (let noun of nouns) {
      for (let postfixGroup of postfixes) {
        for (let postfix of postfixGroup) {
          if (teams.size >= count) break;
          teams.add(`${noun} ${postfix}`);
        }
        if (teams.size >= count) break;
      }
      if (teams.size >= count) break;
    }
    if (teams.size >= count) break;
  }

  if (teams.size < count) {
    for (let adj of adjectives) {
      for (let noun of nouns) {
        if (teams.size >= count) break;
        const twoPartName = `${adj} ${noun}`;
        if (
          !Array.from(teams).some((team) => team.startsWith(twoPartName + " "))
        ) {
          teams.add(twoPartName);
        }
      }
      if (teams.size >= count) break;
    }
  }

  // Shuffle teams before returning
  const teamsArray = Array.from(teams);
  // Fisher-Yates shuffle algorithm
  for (let i = teamsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [teamsArray[i], teamsArray[j]] = [teamsArray[j], teamsArray[i]];
  }
  return teamsArray.slice(0, count);
}

export class MatchesTable {
  constructor(totalMatches = 10000, updateMatchesCount = 5000) {
    this.TOTAL_MATCHES = totalMatches;
    this.UPDATE_MATCHES_COUNT = updateMatchesCount;
    this.matches = [];
    this.sports = ["football", "basketball", "hockey", "tennis", "baseball"];
    // Ensure at least 2 team names if matches are to be generated, for variety.
    this.teamNamePool = generateTeamNames(Math.max(2, 200));

    this.onInitializeSubscribers = [];
    this.onUpdateSubscribers = [];

    this._initializeMatches();
    this._triggerInitialize(this.matches.map((match) => ({ ...match }))); // Send copies
    this._startUpdateInterval();
  }

  get matchesData() {
    return this.matches.map((match) => ({ ...match })); // Return copies of matches
  }

  _generateRandomStartTime() {
    const now = new Date();
    const minutesToSubtract = getRandomElement([10, 20, 30]);
    const startTime = new Date(now.getTime() - minutesToSubtract * 60 * 1000);

    startTime.setMinutes(Math.floor(startTime.getMinutes() / 10) * 10);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    return startTime.toISOString();
  }

  _initializeMatches() {
    if (this.TOTAL_MATCHES === 0) return;

    for (let i = 0; i < this.TOTAL_MATCHES; i++) {
      let team1Name, team2Name;
      if (this.teamNamePool.length === 0) {
        team1Name = "Team A"; // Fallback if pool is empty
        team2Name = "Team B";
      } else if (this.teamNamePool.length === 1) {
        team1Name = this.teamNamePool[0];
        team2Name = this.teamNamePool[0];
      } else {
        do {
          team1Name = getRandomElement(this.teamNamePool);
          team2Name = getRandomElement(this.teamNamePool);
        } while (team1Name === team2Name);
      }

      const match = {
        id: i,
        team1_name: team1Name,
        team2_name: team2Name,
        team1_score: getRandomInt(0, 2),
        team2_score: getRandomInt(0, 2),
        sport: getRandomElement(this.sports),
        start_time: this._generateRandomStartTime(),
        home_win_probability: getRandomFloat(0.1, 0.9, 2),
        betting_1x2_home_win: getRandomFloat(1.1, 10.0),
        betting_1x2_draw: getRandomFloat(1.1, 10.0),
        betting_1x2_away_win: getRandomFloat(1.1, 10.0),
        betting_double_chance_home_win_draw: getRandomFloat(1.05, 5.0),
        betting_double_chance_away_win_draw: getRandomFloat(1.05, 5.0),
        betting_double_chance_home_win_away_win: getRandomFloat(1.05, 5.0),
        betting_over_under_2_5_goals_over: getRandomFloat(1.1, 3.0),
        betting_over_under_2_5_goals_under: getRandomFloat(1.1, 3.0),
      };
      this.matches.push(match);
    }
  }

  _startUpdateInterval() {
    if (this.UPDATE_MATCHES_COUNT > 0 && this.TOTAL_MATCHES > 0) {
      setInterval(() => this._updateRandomMatches(), 1000);
    }
  }

  _updateRandomMatches() {
    const updatedMatchesCollector = []; // Use collector to avoid confusion with class member
    const indicesToUpdate = new Set();

    // Determine the number of matches to update, ensuring it doesn't exceed available matches
    const numMatchesToUpdate = Math.min(
      this.UPDATE_MATCHES_COUNT,
      this.TOTAL_MATCHES
    );
    if (numMatchesToUpdate === 0) return;

    while (indicesToUpdate.size < numMatchesToUpdate) {
      indicesToUpdate.add(getRandomInt(0, this.TOTAL_MATCHES - 1));
    }

    indicesToUpdate.forEach((index) => {
      const match = this.matches[index];
      let changed = false;

      // Randomly change betting values
      const newBettingValues = {
        betting_1x2_home_win: getRandomFloat(1.1, 10.0),
        betting_1x2_draw: getRandomFloat(1.1, 10.0),
        betting_1x2_away_win: getRandomFloat(1.1, 10.0),
        betting_double_chance_home_win_draw: getRandomFloat(1.05, 5.0),
        betting_double_chance_away_win_draw: getRandomFloat(1.05, 5.0),
        betting_double_chance_home_win_away_win: getRandomFloat(1.05, 5.0),
        betting_over_under_2_5_goals_over: getRandomFloat(1.1, 3.0),
        betting_over_under_2_5_goals_under: getRandomFloat(1.1, 3.0),
      };
      for (const key in newBettingValues) {
        if (match.hasOwnProperty(key) && match[key] !== newBettingValues[key]) {
          match[key] = newBettingValues[key];
          changed = true;
        }
      }

      const now = new Date();
      const startTime = new Date(match.start_time);
      const minutesPassed = (now.getTime() - startTime.getTime()) / (1000 * 60);

      // Score update logic
      let totalScore = match.team1_score + match.team2_score;
      if (totalScore === 0 && minutesPassed > 5) {
        if (Math.random() < 0.5) match.team1_score++;
        else match.team2_score++;
        changed = true;
        totalScore = match.team1_score + match.team2_score; // Update total score after change
      }

      if (totalScore < 3 && minutesPassed > 10) {
        if (Math.random() < 0.5) match.team1_score++;
        else match.team2_score++;
        changed = true;
      }

      // Match duration and reset logic
      if (minutesPassed > 30) {
        match.start_time = this._generateRandomStartTime();
        match.team1_score = 0;
        match.team2_score = 0;
        changed = true;
      }

      if (changed) {
        updatedMatchesCollector.push({ ...match }); // Push a copy of the updated match
      }
    });

    if (updatedMatchesCollector.length > 0) {
      this._triggerUpdate(updatedMatchesCollector);
    }
  }

  onInitialize(callback) {
    if (typeof callback === "function") {
      this.onInitializeSubscribers.push(callback);
    }
  }

  onUpdate(callback) {
    if (typeof callback === "function") {
      this.onUpdateSubscribers.push(callback);
    }
  }

  _triggerInitialize(allMatches) {
    this.onInitializeSubscribers.forEach((callback) => {
      try {
        callback(allMatches); // Pass copies of matches
      } catch (e) {
        console.error("Error in onInitialize subscriber:", e);
      }
    });
  }

  _triggerUpdate(updatedMatchesData) {
    // Renamed parameter for clarity
    this.onUpdateSubscribers.forEach((callback) => {
      try {
        callback(updatedMatchesData); // Pass copies of updated matches
      } catch (e) {
        console.error("Error in onUpdate subscriber:", e);
      }
    });
  }
}
