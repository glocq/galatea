"use strict";


// Send pitch bend, aftertouch, and noteon messages when stylus is pressed
function handleStart(midiContext, currentNote, settings, event) {
    if(!currentNote.active) {
  
      let midiOutput = midiContext.access.outputs.get(midiContext.outputID);
  
      let pitch = coordToNote(event.x, settings);
      let basePitch = Math.round(pitch);
      let pitchOffset = pitch - basePitch;
  
      currentNote.basePitch = basePitch;
      currentNote.channel = settings.midiChannel;
      currentNote.active = true;
  
      console.log("Sending noteOn: " + noteOnMessage(currentNote.basePitch, currentNote.channel, event.pressure));
  
      // Pitch bend message
      midiOutput.send(pitchBendMessage(pitchOffset, settings.pitchBendHalfRange, currentNote.channel));
      // Aftertouch message
      midiOutput.send(aftertouchMessage(event.pressure, currentNote.basePitch, currentNote.channel));
      // NoteOn message
      midiOutput.send(noteOnMessage(currentNote.basePitch, currentNote.channel, event.pressure));
    }
  }
  
  // Send noteoff message when stylus is removed
  function handleEnd(midiContext, currentNote, settings, event) {
    if(currentNote.active) {
  
      let midiOutput = midiContext.access.outputs.get(midiContext.outputID);
  
      currentNote.active = false;
  
      // NoteOn message
      midiOutput.send(noteOffMessage(currentNote.basePitch, currentNote.channel));
    }
  }
  
  // Send pitch bend and aftertouch messages when stylus is in contact and gets moved
  function handleMove(midiContext, currentNote, settings, event) {
    if(currentNote.active) {
      let midiOutput = midiContext.access.outputs.get(midiContext.outputID);
  
      let pitch = coordToNote(event.x, settings);
      let pitchOffset = pitch - currentNote.basePitch;
  
      // Pitch bend message
      midiOutput.send(pitchBendMessage(pitchOffset, settings.pitchBendHalfRange, currentNote.channel));
      // Aftertouch message
      midiOutput.send(aftertouchMessage(event.pressure, currentNote.basePitch, currentNote.channel));
    }
  }  
