"use strict";

window.addEventListener("DOMContentLoaded", () => {

  let settings = { midiChannel: 0
                 , pitchBendHalfRange: 12
                 , lowestPitch: 48
                 , highestPitch: 72
                 , blackKeyRatio: 0.8
                 };

  document.getElementById("lowestPitch").value = settings.lowestPitch;
  document.getElementById("highestPitch").value = settings.highestPitch;
  document.getElementById("pitchBendHalfRange").value = settings.pitchBendHalfRange;

  drawControlSurface(settings);

  // MIDI setup
  let midiContext = { valid: false };
  midiSetup(midiContext, document.getElementById("midiOutputSelector"));
  let currentNote = { active: false };

  // Control surface pointer handling
  let controlSurface = document.getElementById("controlSurface");
  controlSurface.addEventListener("pointerdown",
    handleStart.bind(null, midiContext, currentNote, settings), false);
  controlSurface.addEventListener("pointerup",
    handleEnd.bind(null, midiContext, currentNote, settings), false);
  controlSurface.addEventListener("pointercancel",
    handleEnd.bind(null, midiContext, currentNote, settings), false);
  controlSurface.addEventListener("pointermove",
    handleMove.bind(null, midiContext, currentNote, settings), false);

  // Fullscreen
  let fullscreenButton = document.getElementById("fullscreenButton");
  fullscreenButton.addEventListener("click", controlSurfaceFullscreen.bind(null, controlSurface));

  // Resize
  addEventListener("resize", (event) => drawControlSurface(settings));

  // Change settings based on user input
  let lowestPitch = document.getElementById("lowestPitch");
  let highestPitch = document.getElementById("highestPitch");
  let pbhr = document.getElementById("pitchBendHalfRange");
  lowestPitch.addEventListener("change", lowestPitchChanged.bind(null, settings));
  highestPitch.addEventListener("change", highestPitchChanged.bind(null, settings));
  pbhr.addEventListener("change", pbhrChanged.bind(null, settings));
});

function controlSurfaceFullscreen(controlSurface, event) {
  if (controlSurface.requestFullscreen) {
    controlSurface.requestFullscreen();
  }
}

function lowestPitchChanged(settings, event) {
  settings.lowestPitch = Number(event.target.value);
  drawControlSurface(settings);
}

function highestPitchChanged(settings, event) {
  settings.highestPitch = Number(event.target.value);
  drawControlSurface(settings);
}

function pbhrChanged(settings, event) {
  settings.pitchBendHalfRange = Number(event.target.value);
}

// TODO it would probably be nice to call that when the canvas gets resized,
// so as to adapt the resolution
function drawControlSurface(settings) {
  const canvas = document.getElementById("controlSurface");
  // First 
  canvas.setAttribute("width", canvas.offsetWidth);
  canvas.setAttribute("height", canvas.offsetHeight);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(settings.lowestPitch != settings.highestPitch) {
    // The width a semitone takes up on the canvas
    const semitoneWidth = canvas.width / (settings.highestPitch - settings.lowestPitch);
    const blackKeyWidth = settings.blackKeyRatio * semitoneWidth;

    // Draw a white background
  ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw each semitone
    for(let note = Math.floor(settings.lowestPitch); note < Math.ceil(settings.highestPitch); note++) {
      const position = canvas.width * (note - settings.lowestPitch) / (settings.highestPitch - settings.lowestPitch);
      // A gray band for black keys
      const pitchClass = note % 12;
      ctx.fillStyle = "gray";
      if(pitchClass === 1 || pitchClass === 3 || pitchClass === 6 || pitchClass === 8 || pitchClass === 10) {
        ctx.fillRect(position - 0.5 * blackKeyWidth, 0, blackKeyWidth, canvas.height);
      }
      // A vertical line
      ctx.beginPath();
      ctx.moveTo(position, 0);
      ctx.lineTo(position, canvas.height);
      ctx.stroke();
    }
  }
}
