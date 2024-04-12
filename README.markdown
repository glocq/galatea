# Galatea

## Running

Prerequisites: You should have Node.js and npm installed.

1. Compile by running `npx spago bundle --outfile webpage/index.js`. This produces a file `index.js` in the `webpage/` directory.

You can try to directly open `webpage/index.html`, which links to `index.js`, with your browser, but MIDI output probably won't work due to security limitations, so you will have to make a local server.

2. Serve the files by running `npx serve` from inside `webpage/`.
3. Open the page with your browser. `npx serve` should have given you the address; it looks something like `http://localhost:3000`

