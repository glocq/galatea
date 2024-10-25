# Galatea

Galatea is a cross-platform tool that lets you turn your mouse or graphic tablet into a continuous MIDI controller. It was developed with graphic tablets in mind, but it should work with anything that is recognized by your browser as a "pointer".

You can see a demo of a music piece played using Galatea [here](https://www.youtube.com/watch?v=aAOH1WcN19U) (note that Galatea only turns your pointer data into MIDI, and you will need a MIDI synthesizer such as [Surge](https://surge-synthesizer.github.io/) to play audio. Additionally, the demo makes use of a custom pitch correction algorithm implemented in [PlugData](https://plugdata.org/).

## Quick Start

1. Open the application which you want to receive MIDI data (your DAW, Pure Data, Max/MSP...)
1. Head to the Galatea webpage over at https://glocq.github.io/en/galatea/ using your favorite browser.
2. Your browser should ask you to allow Web MIDI access; if it does not, try clicking the button next to "MIDI Output:". Click "Allow" (or "Accept", or something like that).
3. A dropdown menu should appear, with the available outputs as the options. Select the application/output of your choice.
4. Click-and-drag, or press your stylus and move, in the area that looks like a piano keyboard. Your application should receive MIDI data.

## MIDI Messages Sent

The MIDI messages sent depend on the settings (see below), and in particular on whether you are in Instrument Mode or in Controller (CC) Mode.

### Instrument Mode

Instrument Mode allows you to control a MIDI synthesizer out of the box.

In Instrument Mode, a NoteOn message is sent each time you click/your stylus comes into contact with the piano keyboard-like area, and a NoteOff each time you unclick/lift your stylus. The NoteOn pitch (which we will refer to as "base pitch") is chosen to be the semitone value closest to where you clicked.

In addition, a stream of Pitch Bend and Aftertouch messages are sent based on where your pointer is relative to the base pitch, and how hard you are pressing your stylus (if applicable).

Depending on the base pitch and the value of the pitch bend range (see "Settings" below), pitch bend will not function properly outside of a certain area — namely, the area between _the base note minus the pitch bend half-range_, and _the base note plus the pitch band half-range_. To help you, a red overlay is superimposed on the playing area whenever you are playing, telling you where not to go. If you find it to be too narrow, I encourage you to change the _Pitch Bend Half-Range_ setting (see below).

### Controller (CC) Mode

Controller (CC) Mode sends rawer data to let you free to interpret your gestures however you see fit, using e.g. Pure Data or Max/MSP.

In Controller Mode, only CC messages are sent — no NoteOns and NoteOffs. You directly select the CC controller to which you wish to see the horizontal, vertical position, and pressure of your stylus (if applicable) mapped, and the whole range of possible output values is used. In particular, although the playing area still displays a piano keyboard-like mask, this has no influence on the data sent.

## Interface

### The Playing Area

This is what you interact with using your pointer device (mouse or tablet). It displays a piano keyboard-like image to help you be accurate. Note that unlike a piano, vertical lines appear in the middle of notes here — not in-between notes. Those vertical lines correspond to "on-tune" pitches, the ones you would target if you intended to play exactly on pitch without any ornaments.

The playing area also displays a visual indicator of where your pointer is and how hard you press it. In instrument mode, when you are playing a note, it also displays a red overlay that tells you where pitch bend will stop working.

Right under the playing area, the "Set Fullscreen" button... sets the playing area fullscreen. This is useful to get a larger surface, but also to avoid accidentally clicking somewhere else and get a pitch layout independent of your browser window's size.

### Settings

* Instrument/Controller Mode: Switches between modes (see above).
* Left/Right Pitch: Sets what pitch the leftmost/rightmost side of the playing area corrsponds to. This affects the appearance of the playing area, and, in instrument mode, the MIDI data actually output.
* MIDI Channel: Sets what MIDI channel the output messages will be sent to.
* Pitch Bend Half Range (instrument mode only): Sets the half-range of the MIDI pitch bend messages. The narrower the range, the less free you are, but if you set it too large you might lose a liiittle bit of precision. **IMPORTANT**: If you change this setting, you **need** to set your synthesizer's pitch bend range accordingly, otherwise the notes you hear will not correspond to the notes you play.
* Horizontal/vertical axis/pressure CC type (controller mode only): What MIDI controller message will be sent for each dimension. Controllers 0 through to 31 have better resolution: if you pick one of them, two messages will be sent, with the second one corresponding to the least significant bit (LSB) of the controller.
* MIDI Output: If MIDI access is granted and some MIDI outputs are detected, this will display a dropdown menu with all available MIDI outputs. Otherwise, there will be a button to try requesting MIDI access again.

## Running Galatea Locally

Galatea is free software, you can inspect the code and run it from your machine if you do not want to rely on someone else (me)'s webpage. Security reasons make it a little more complicated than it could be, though, so as a prerequisite, you need to be familiar with the command line, and have Node.js and npm installed.

1. Download this repository, and `cd` into it using the terminal.
2. Compile the code by running `npm install && npx spago bundle --outfile webpage/index.js`. This produces a file `index.js` in the `webpage/` directory.
3. Serve the files by running `npx serve` from inside `webpage/`.
4. Open the page with your browser. `npx serve` should have given you the address; it looks something like `http://localhost:3000`

The same webpage should open as the one available at https://glocq.github.io/en/galatea/

## Tips and Remarks

* The screen is nice to try things out, but for a more controllable setting, I recommend sticking to a pitch range and placing visual indicators (drawing lines with a marker, or superimposing a paper mask) directly on your tablet. You will be more accurate if you rely on a physical object under your eyes than on the motion of your pointer on the screen.
* Please tell me about your experience, file issues on github, etc. The more feedback, especially on other OSs, the better. In particular, feel free to tell me about your workflow and the options you would like to see for the type of MIDI data that gets sent. I am still thinking about the best way to output gesture data in MIDI form.

