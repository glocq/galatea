module Galatea where

-- General-purposes modules
import Prelude
import Data.Maybe              (Maybe(..))
import Data.Tuple.Nested       ((/\))
import Control.Monad.ST.Global (toEffect)
import Effect                  (Effect)
-- Deku-related modules
import FRP.Event           as FRP
import Deku.Core           as D
import Deku.Do             as Deku
import Deku.Hooks          as DH
-- Local modules
import Types as Types
import ControlSurface as ControlSurface
import Settings       as Settings
import MidiEmitter    as MidiEmitter


component :: Effect D.Nut
component = do

  -- This component is wrapped in ST Global, so we have to extract its value
  -- before using it:
  midiEmitter <- MidiEmitter.component

  -- Application graph: events
  surfaceOut       <- toEffect FRP.create -- messages that come out of the control surface
  updateMidiOutput <- toEffect FRP.create -- currently selected MIDI output
  setFullscreen    <- toEffect FRP.create

  pure $ Deku.do

    -- Application graph: poll(s)
    setSettings        /\ settings        <- DH.useState Types.defaultSettings
    setMidiAccess      /\ midiAccess      <- DH.useState Nothing
    setPitchBendLimits /\ pitchBendLimits <- DH.useState Nothing

    -- Putting together all application graph edges, aka communication channels:
    let wires = { surfaceOut:         surfaceOut
                , updateMidiOutput:   updateMidiOutput
                , setFullscreen:      setFullscreen
                , settings:           settings
                , setSettings:        setSettings
                , midiAccess:         midiAccess
                , setMidiAccess:      setMidiAccess
                , pitchBendLimits:    pitchBendLimits
                , setPitchBendLimits: setPitchBendLimits
                }

    -- The actual web app:
    ControlSurface.component wires <>
      Settings.component     wires <>
      midiEmitter            wires
