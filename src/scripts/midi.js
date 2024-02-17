"use strict";


/**
 * MIDI setup
 */

function midiSetup(midiContext, midiOutputDropdown) {
  navigator.requestMIDIAccess().then(
    (access) => midiSuccess(midiContext, midiOutputDropdown, access),
    (reason) => midiFailure(midiContext)
  );
}

function midiSuccess(midiContext, midiOutputDropdown, midiAccess) {
  midiContext.access = midiAccess;
  midiContext.outputID = populateMidiDropdown(midiOutputDropdown, midiContext);
  midiContext.valid = true;

  // Change MIDI context whenever another element is selected in the dropdown list
  midiOutputDropdown.addEventListener("change", onMidiOutputChange.bind(null, midiContext));
}

function onMidiOutputChange(midiContext, event) {
  midiContext.outputID = event.target.value;
}

function midiFailure(midiContext) {
  // TODO display error message in webpage
  console.log("Failed to get MIDI access");
  // Delete all contex,t if any
  midiContext.valid = false;
}

// Populate a dropdown list with available MIDI outputs,
// and return the first one, if any (otherwise, returns null)
function populateMidiDropdown(dropdown, midiContext) {

  let firstOutput = null;

  for(const [key, value] of midiContext.access.outputs.entries()) {

    // Create a new entry in the dropdown list:
    let newOption = dropdown.appendChild(document.createElement("option"));
    newOption.appendChild(document.createTextNode(value.name));
    let valAttribute = document.createAttribute("value");
    valAttribute.value = key;
    newOption.setAttributeNode(valAttribute);

    // Set first MIDI output if applicable:
    if(firstOutput === null) {
      firstOutput = key;
    }
  }
  return firstOutput;
}


/**
 * MIDI message utilities
 */


// Turn horizontal coordinate on the canvas surface into pitch value
// TODO make reactive to size changes
function coordToNote(coordinate, settings) {
  if(settings.lowestPitch === settings.highestPitch) {
    return settings.lowestPitch;
  } else {
    let width = document.getElementById("controlSurface").width;
    return (settings.lowestPitch + (coordinate/width) * (settings.highestPitch - settings.lowestPitch));
  }
}

// Convert a value between 0. and 1. into an integer between 0 and 127
function midiValue(floatingValue) {
  return Math.max(0, Math.min(127, Math.floor(floatingValue * 128)));
}

function aftertouchMessage(value, note, channel) {
  return([160 + channel, note, midiValue(value)]);
}

function pitchBendMessage(value, pitchBendHalfRange, channel) {

  console.log(value);
  let normalized = Math.max(0, Math.min(16383, 16384 * (value / (2 * pitchBendHalfRange) + 0.5)));
  console.log(normalized);

  // Most/least significant bits:
  let msb = Math.floor(normalized / 127);
  let lsb = Math.floor(normalized % 127);

  return([224 + channel, lsb, msb]);
}

// Warning: velocity must be given as a normalized value between 0. and 1.!
// (NOT an integer between 0 and 127)
function noteOnMessage(note, channel, normalizedVelocity) {
  return([144 + channel, note, midiValue(normalizedVelocity)]);
}

function noteOffMessage(note, channel) {
  return([128 + channel, note, 0]);
}
