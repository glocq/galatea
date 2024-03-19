module Galatea (component) where

-- General-purpose modules
import Prelude
import Type.Proxy       (Proxy(Proxy))
import Effect.Aff.Class (class MonadAff)
-- Halogen and web-related modules
import Halogen                  as H
import Halogen.HTML             as HTML
import Halogen.HTML.Events      as HTML.Ev
import Halogen.HTML.CSS (style) as H.CSS
import CSS                      as CSS
-- Local modules
import ControlSurface as ControlSurface
import MidiHub        as MidiHub
import WebMidi        as MIDI
import Types          as Types



-- Types related to this component

type State = { pitchRange :: Types.PitchRange }

defaultState :: State
defaultState = { pitchRange: Types.defaultPitchRange }

data Action = MidiTest

-- Children management
type Slots = ( midiHub        :: MidiHub.Slot        Unit
             , controlSurface :: ControlSurface.Slot Unit
             )

_midiHub :: Proxy "midiHub"
_midiHub = Proxy

_controlSurface :: Proxy "controlSurface"
_controlSurface = Proxy

-- The Component

component :: forall query input output m. MonadAff m
          => H.Component query input output m
component = H.mkComponent
  { initialState: const defaultState
  , render: const $ HTML.div_
      [ HTML.button
          [ HTML.Ev.onClick $ const MidiTest ]
          [ HTML.text "Send MIDI message!" ]
      , HTML.div
          [ H.CSS.style $ do
              CSS.width  $ CSS.pct 100.0
              CSS.height $ CSS.px  300.0
          ]
          [ HTML.slot_ _controlSurface unit ControlSurface.component Types.defaultPitchRange ]
      , HTML.slot_ _midiHub unit MidiHub.component unit
      ]
  , eval: H.mkEval $ H.defaultEval
            { handleAction = handleAction }
  }


handleAction :: forall output m. MonadAff m
             => Action -> H.HalogenM State Action Slots output m Unit
handleAction = case _ of
  MidiTest -> do
    _ <- H.request _midiHub unit (MidiHub.SendMidi (MIDI.noteOn 69 0 64))
    pure unit
