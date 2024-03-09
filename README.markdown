Galatea
========

Galatea allows you to turn a graphic tablet, a mouse, or any device that acts as a pointer, into an expressive MIDI controller.

Using
------

### Launching the page

#### Option 1: Access the online demo

A demo is available at https://glocq.github.io/en/galatea. Keep in mind that
this is an early stage demo, and the interface is not documented yet. Regardless,
the online demo is just as capable as a self-hosted version.

#### Option 2: Self-serve the webpage

The process for uself-hosting Galatea is a little involved[^1]. The following
is a possible course of action. If you know what you're doing, feel free to use
another way to serve the files[^2].

1. [Install Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
2. Open a terminal, change directory into the contents of the `src/` subdirectory.
3. Run:
```
npx browser-sync start --server
```

Now you should be able to access the page on `localhost:3000` on your browser or whatever other address is indicated.

### Using the page

Open the page with your browser, click "Allow" when prompted to allow web MIDI, and setup your DAW/synthesizer such that it is able to use the MIDI output of the webpage.

Possible next steps
--------------------

* More detailed documentation
* More configuration options (MIDI channel live change, MPE...)
* Multiple pointer input (e.g. tablet touch)
* Pitch correction, possibly via a separate VST/CLAP plugin, possibly a commercial one

[^1]: The technical reason is: major web browsers will only allow the Web MIDI API to run in a "secure" context, which includes pages served over HTTPS or locally over HTTP, but *not* pages opened as local files.
[^2]: Note that for some reason, the page is not considered a secure context when served using the Python module `http.server`.

* Pitch correction, possibly via a separate VST/CLAP plugin, possibly a commercial one

[^1]: The technical reason is: major web browsers will only allow the Web MIDI API to run in a "secure" context, which includes pages served over HTTPS or locally over HTTP, but *not* pages opened as local files.
[^2]: Note that for some reason, the page is not considered a secure context when served using the Python module `http.server`.
