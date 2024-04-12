module Settings where

-- General-purpose modules
import Prelude
import Effect.Aff        as Aff
import Data.Maybe        (Maybe(..))
import Data.Either       (Either, hush)
import Effect            (Effect)
-- Web utilities
import Color   as Color
import CSS     as CSS
import WebMidi as MIDI
-- Deku-related modules
import Deku.Core           as D
import Deku.Hooks          ((<#~>))
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA
import Deku.DOM.Listeners  as DL
import Deku.DOM.Self       as Self
import Deku.CSS            as DC
-- Local modules
import Types as Types



-- | A component which displays an interface
-- | for choosing the application settings.
component :: Types.Wires -> D.Nut
component wires = Deku.do

  DD.div_ $

    -- Select playing mode
    [ modeButton Types.Instrument
    , modeButton Types.Manual
    -- Set pitch range
    , leftPitchInput
    , rightPitchInput
    -- Select MIDI output
    , midiOutputDropdown
    ] <@> wires



modeButton :: Types.Mode -> Types.Wires -> D.Nut
modeButton mode wires =
  DD.button
    -- Style button based on whether it corresponds to the selected mode:
    [ DA.style $ wires.settings <#> \s -> DC.render $
        if s.mode == mode then activeButtonStyle
                         else inactiveButtonStyle
    -- Set mode upon clicking button:
    , DL.click $ wires.settings <#> \s -> const $
        wires.setSettings $ s {mode = mode}
    ]
    [ DD.text_ $ show mode <> " Mode" ]



activeButtonStyle :: CSS.CSS
activeButtonStyle = do
  CSS.backgroundColor $ Color.rgb' 0.1 0.1 0.6
  CSS.color $ Color.white

inactiveButtonStyle :: CSS.CSS
inactiveButtonStyle = do
  CSS.backgroundColor $ Color.white
  CSS.color $ Color.black



leftPitchInput :: Types.Wires -> D.Nut
leftPitchInput wires =
  DD.input
    [ DA.xtypeNumber
    -- Upon changing value:
    , DL.numberOn DL.input $ wires.settings <#> \s value -> do
        -- 1. Update value
        wires.setSettings $ s {leftPitch = value}
        -- 2. Tell control surface to refresh background
        wires.refreshBackground.push unit
    ] []


rightPitchInput :: Types.Wires -> D.Nut
rightPitchInput wires =
  DD.input
    [ DA.xtypeNumber
    -- Upon changing value:
    , DL.numberOn DL.input $ wires.settings <#> \s value -> do
        -- 1. Update value
        wires.setSettings $ s {rightPitch = value}
        -- 2. Tell control surface to refresh background
        wires.refreshBackground.push unit
    ] []


midiOutputDropdown :: Types.Wires -> D.Nut
midiOutputDropdown wires =
  DD.select
    [ Self.self_ \_ -> Aff.runAff_ (setAccess wires) MIDI.requestAccess ]
    [ dropdown wires ]


setAccess :: forall error
           . Types.Wires
          -> Either error (Maybe MIDI.Access)
          -> Effect Unit
setAccess wires emAccess = wires.setMidiAccess $ join $ hush emAccess



dropdown :: Types.Wires -> D.Nut
dropdown wires = wires.midiAccess <#~> case _ of
  Nothing -> mempty
  Just access -> D.fixed $ MIDI.outputIDs access <#> \id ->
    case MIDI.getOutput access id of
      Nothing     -> mempty
      Just output -> DD.option
                       [ DA.value_ id ]
                       [ DD.text_ $ MIDI.outputName output]
