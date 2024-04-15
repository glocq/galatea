module Types where

-- General-purpose modules
import Prelude
import Data.Tuple.Nested (type (/\))
import Data.Maybe        (Maybe)
import Effect            (Effect)
-- Hyrule modules:
import FRP.Poll  (Poll)
import FRP.Event (EventIO)
-- Web utilities
import WebMidi as MIDI


-- | Communication channels, or "wires", between components,
-- | to transmit events and polls
type Wires =
  -- Events
  { surfaceOut         :: EventIO SurfaceMsg
  , updateMidiOutput   :: EventIO (Maybe MIDI.Output)
  -- Polls and poll updaters
    -- Settings
    , settings    :: Poll Settings
    , setSettings :: Settings -> Effect Unit
    -- MIDI:
    , midiAccess    :: Poll (Maybe MIDI.Access)
    , setMidiAccess :: Maybe MIDI.Access -> Effect Unit
    -- The control surface area outside of which pitch bend stops working.
    -- Values are between 0.0 and 1.0, in normalized control surface coordinates
    , pitchBendLimits    :: Poll (Maybe (Number /\ Number))
    , setPitchBendLimits :: Maybe (Number /\ Number) -> Effect Unit
  }

data Mode = Instrument | CC

derive instance eqMode :: Eq Mode

instance showMode :: Show Mode where
  show Instrument = "Instrument"
  show CC         = "CC"


type Settings = { mode :: Mode
                , leftPitch  :: Number
                , rightPitch :: Number
                , blackKeyRatio :: Number
                , midiChannel :: Int
                -- Settings for instrument mode
                , pitchBendHalfRange :: Number
                -- Settings for CC mode
                , horizontalCC :: Int
                , verticalCC   :: Int
                , pressureCC   :: Int
                }


defaultSettings :: Settings
defaultSettings = { mode: Instrument
                  , leftPitch:  48.0
                  , rightPitch: 72.0
                  , blackKeyRatio: 0.8
                  , midiChannel: 0
                  -- Settings for instrument mode
                  , pitchBendHalfRange: 2.0
                  -- Settings for raw mode
                  , horizontalCC: 10
                  , verticalCC:   1
                  , pressureCC:   2
                  }

type PointerState = Maybe { x :: Number
                          , y :: Number
                          , pressure :: Number
                          }

data SurfaceDimension = Horizontal | Vertical | Pressure

data SurfaceMsg
  = Start { x :: Number, y :: Number, pressure :: Number }
  | Move  { x :: Number, y :: Number, pressure :: Number }
  | Stop  { x :: Number, y :: Number }
