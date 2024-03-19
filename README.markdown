Galatea
========

Galatea allows you to turn a graphic tablet, a mouse, or any device that acts as a pointer, into an expressive MIDI controller.

This is a work-in-progress rewrite of the application in Purescript. Not functional yet!

Using
------
### Launching the page

#### Option 1: Access the online demo

A demo is available at https://glocq.github.io/en/galatea. Keep in mind that
this is an early stage demo, and the interface is not documented yet. Regardless,
the online demo is just as capable as a self-hosted version.

#### Option 2: Self-serve the webpage

##### Building

0. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
1. `cd` into this repository, and run `npx spago bundle-app --to webpage/index.js`. A file `index.js` should appear in the `webpage/` subdirectory.
2. Open `webpage/index.html` with your favorite browser.

##### Serving

1. From inside `webpage/`, run `npx serve`.

Now you should be able to access the page on `localhost:3000` on your browser or whatever other address is indicated.

### Using the page

Open the page with your browser, click "Allow" when prompted to allow web MIDI, and setup your DAW/synthesizer such that it is able to use the MIDI output of the webpage.

Possible next steps
--------------------

* More detailed documentation
* More configuration options (MIDI channel live change, MPE...)
* Multiple pointer input (e.g. tablet touch)
* Pitch correction, possibly via a separate VST/CLAP plugin, possibly a commercial one

