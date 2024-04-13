module Galatea where

-- General-purposes modules
import Prelude
import Data.Maybe              (Maybe(..))
import Data.Tuple.Nested       ((/\))
import Control.Monad.ST        (ST)
import Control.Monad.ST.Global (Global)
-- Deku-related modules
import FRP.Event           as FRP
import Deku.Core           as D
import Deku.Do             as Deku
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA
import Deku.Hooks          as DH
-- Local modules
import Types as Types
import ControlSurface as ControlSurface
import Settings       as Settings
import MidiEmitter    as MidiEmitter


galatea :: ST Global D.Nut
galatea = do

  -- This component is wrapped in ST Global, so we have to extract its value
  -- before using it:
  midiEmitter <- MidiEmitter.component

  -- Application graph: events
  surfaceOut        <- FRP.create -- messages that come out of the control surface
  refreshBackground <- FRP.create -- ping emitted when the background needs redrawing
  updateMidiOutput  <- FRP.create -- currently selected MIDI output

  pure $ Deku.do

    -- Application graph: poll(s)
    setSettings   /\ settings   <- DH.useState Types.defaultSettings
    setMidiAccess /\ midiAccess <- DH.useState Nothing

    -- Putting together all application graph edges, aka communication channels:
    let wires = { surfaceOut: surfaceOut
                , refreshBackground: refreshBackground
                , updateMidiOutput: updateMidiOutput
                , settings:    settings
                , setSettings: setSettings
                , midiAccess:    midiAccess
                , setMidiAccess: setMidiAccess
                }

    -- The actual web app:
    DD.div
      [ DA.id_ "galatea" ]
      [ ControlSurface.component wires
      , Settings.component       wires
      , midiEmitter              wires
      ]
