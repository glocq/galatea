module Types where

-- General-purpose modules
import Prelude
import Data.Maybe (Maybe)
import Effect     (Effect)
-- Hyrule modules:
import FRP.Poll  (Poll)
import FRP.Event (EventIO)
-- Web utilities
import WebMidi as MIDI


-- | Communication channels, or "wires", between components,
-- | to transmit events and polls
type Wires =
  -- Events
  { surfaceOut :: EventIO SurfaceMsg
  , refreshBackground :: EventIO Unit
  , updateMidiOutput :: EventIO (Maybe MIDI.Output)
  -- Polls and poll updaters
    -- Settings
    , settings    :: Poll Settings
    , setSettings :: Settings -> Effect Unit
    -- MIDI:
    , midiAccess    :: Poll (Maybe MIDI.Access)
    , setMidiAccess :: Maybe MIDI.Access -> Effect Unit
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
                , midiChannel :: Int
                , pitchBendHalfRange :: Number
                }

defaultSettings :: Settings
defaultSettings = { mode: Instrument
                  , leftPitch:  48.0
                  , rightPitch: 72.0
                  , blackKeyRatio: 0.8
                  , midiChannel: 0
                  , pitchBendHalfRange: 2.0
                  }

data SurfaceMsg
  = Start { x :: Number, y :: Number, pressure :: Number }
  | Move  { x :: Number, y :: Number, pressure :: Number }
  | Stop  { x :: Number, y :: Number }
