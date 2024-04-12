module Types where

import Prelude
import Data.Maybe (Maybe)
import Effect     (Effect)
import FRP.Poll   (Poll)
import FRP.Event  (EventIO)
import WebMidi    as MIDI


-- Wires between components, to transmit events and polls
type Wires = { surfaceOut :: EventIO SurfaceMsg
             , refreshBackground :: EventIO Unit
             -- Polls and poll updaters:
             , settings    :: Poll Settings
             , setSettings :: Settings -> Effect Unit
             , midiAccess    :: Poll (Maybe MIDI.Access)
             , setMidiAccess :: Maybe MIDI.Access -> Effect Unit
             , midiOutput    :: Poll (Maybe MIDI.Output)
             , setMidiOutput :: Maybe MIDI.Output -> Effect Unit
             }

data Mode = Instrument | Manual

derive instance eqMode :: Eq Mode

instance showMode :: Show Mode where
  show Instrument = "Instrument"
  show Manual     = "Manual"


type Settings = { mode :: Mode
                , leftPitch  :: Number
                , rightPitch :: Number
                , blackKeyRatio :: Number
                }

defaultSettings :: Settings
defaultSettings = { mode: Instrument
                  , leftPitch:  48.0
                  , rightPitch: 72.0
                  , blackKeyRatio: 0.8
                  }

data SurfaceMsg
  = Start { x :: Number, y :: Number, pressure :: Number }
  | Move  { x :: Number, y :: Number, pressure :: Number }
  | Stop  { x :: Number, y :: Number }
