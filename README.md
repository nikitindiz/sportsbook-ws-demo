# Live Sports Matches App Demo

<img src="demo.png">

This project contains demo app to display live sports matches.

## Basic functionality

- Displays 10_000 live matches using `react-virtualized`
- Contains sport icon
- Competitor names
- Match start time
- Current score
- `1X2` and `Total` betting options.
- Odds are clickable, restored on refresh, available cross-tab, highlighted
- Highlights odds changes (green for increased value, red for decreased) on receive
- Scroll position stored per tab
- Contains mock WebSocket server, it produces 10000 mock matches and 5000 events (odds update, scores update) every second.

It consists of:

- WebSocket Node.js server (`/server` folder)
- React UI (`/src` folder)

Use `npm run dev` to run both server and ui on your local machine.

Default UI address http://localhost:5173
Default WebSocket server address ws://localhost:3000

Demo deployed to https://sportsbook-demo.nikitin-alex.com/
