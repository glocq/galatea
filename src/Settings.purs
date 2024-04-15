module Settings where

-- General-purpose modules
import Prelude
import Data.Int          (round)
import Data.Tuple.Nested ((/\))
import Data.Maybe        (Maybe(..), isNothing)
import Data.Either       (Either, hush)
import Data.Array        (head, (..))
import Effect.Aff        (runAff_)
import Effect.Exception  (throw)
import Effect            (Effect)
-- Web
import Web.Event.Event            as Event
import Web.HTML.HTMLSelectElement as Select
import Color                      as Color
import CSS                        as CSS
import WebMidi                    as MIDI
-- Deku-related modules
import Deku.Core           as D
import Deku.Hooks          ((<#~>))
import Deku.Hooks          as DH
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA
import Deku.DOM.Listeners  as DL
import Deku.DOM.Self       as Self
import Deku.CSS            as DC
import FRP.Poll            as Poll
-- Local modules
import Util      (($?))
import Types     as Types
import MidiTable (ccName)



-- | A component which displays an interface
-- | for choosing the application settings.
component :: D.NutWith Types.Wires
component wires = DD.div_ $
  [ modeButton Types.Instrument
  , modeButton Types.CC
  , leftPitchInput
  , rightPitchInput
  , midiChannel
  , modeSpecificSettings
  , midiOutputDropdown
  ] <@> wires



--------------------------------------------------------------------------------

--------------------------
-- Control Mode Buttons --
--------------------------

modeButton :: Types.Mode -> D.NutWith Types.Wires
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

--------------------------------------------------------------------------------


leftPitchInput :: D.NutWith Types.Wires
leftPitchInput wires =
  DD.input
    [ DA.xtypeNumber
    , DA.step_ "1"
    , DA.value_ $ show $ round Types.defaultSettings.leftPitch
    -- Upon changing value:
    , DL.numberOn DL.input $ wires.settings <#> \s value ->
        wires.setSettings $ s {leftPitch = value}
    ] []




rightPitchInput :: D.NutWith Types.Wires
rightPitchInput wires =
  DD.input
    [ DA.xtypeNumber
    , DA.step_ "1"
    , DA.value_ $ show $ round Types.defaultSettings.rightPitch
    -- Upon changing value:
    , DL.numberOn DL.input $ wires.settings <#> \s value ->
        wires.setSettings $ s {rightPitch = value}
    ] []




midiChannel :: D.NutWith Types.Wires
midiChannel wires =
  DD.input
    [ DA.xtypeNumber
    , DA.min_ "1"
    , DA.max_ "16"
    , DA.step_ "1"
    , DA.value_ $ show $ Types.defaultSettings.midiChannel
    , DL.numberOn DL.input $ wires.settings <#> \s value ->
        -- Important: we convert from the 1-16 range to the 0-15 range here:
        wires.setSettings $ s {midiChannel = round value - 1}
    ] []



modeSpecificSettings :: D.NutWith Types.Wires
modeSpecificSettings wires = wires.settings <#~>
  \settings -> case settings.mode of
    Types.Instrument -> pitchBendHalfRangeInput wires
    Types.CC         -> ccDropdownGroup wires


--------------------------------------------------------------------------------

----------------------------------------
-- CC Message Type Selection Dropdown --
----------------------------------------

ccDropdownGroup :: D.NutWith Types.Wires
ccDropdownGroup wires = D.fixed [ ccDropdown Types.Horizontal 10 wires
                                , ccDropdown Types.Vertical    1 wires
                                , ccDropdown Types.Pressure    2 wires
                                ]


ccDropdown :: Types.SurfaceDimension -> Int -> D.NutWith Types.Wires
ccDropdown dimension initialIndex wires =
  DD.select
    [ DL.change $ ccSelectionCallback dimension wires
    -- Initialize dropdown to given initial index:
    , Self.self_ $ \elt -> Select.setSelectedIndex initialIndex $? Select.fromElement elt
    ] $ ccOption <$> (0 .. 119) -- Warning: do not modify the range without reading
                                -- the warning in ccSelectionCallback first


ccOption :: Int -> D.Nut
ccOption number =
  DD.option [ DA.value_ $ show number]
            [ DD.text_  $ show number <> ": " <> ccName number ]


ccSelectionCallback :: Types.SurfaceDimension
                    -> Types.Wires
                    -> Poll.Poll (Event.Event -> Effect Unit)
ccSelectionCallback dimension wires = wires.settings <#> callback
  where
  callback settings event =
    case Event.target event >>= Select.fromEventTarget of
      Nothing -> throw "ccSelectionCallback: Not a <select> element"
      Just elt -> do
        ccNumber <- Select.selectedIndex elt -- Warning: this assumes that entry 1 corresponds to 1, entry 2 to 2, etc.
        case dimension of
          Types.Horizontal -> wires.setSettings $ settings {horizontalCC = ccNumber}
          Types.Vertical   -> wires.setSettings $ settings {verticalCC   = ccNumber}
          Types.Pressure   -> wires.setSettings $ settings {pressureCC   = ccNumber}


--------------------------------------------------------------------------------

pitchBendHalfRangeInput :: D.NutWith Types.Wires
pitchBendHalfRangeInput wires =
  DD.input
    [ DA.xtypeNumber
    , DA.min_ "0"
    , DA.step_ "1"
    , DA.value_ $ show $ round Types.defaultSettings.pitchBendHalfRange
    , DL.numberOn DL.input $ wires.settings <#> \s value ->
        wires.setSettings $ s {pitchBendHalfRange = value}
    ] []

--------------------------------------------------------------------------------

------------------------------------
-- MIDI Output Selection Dropdown --
------------------------------------


midiOutputDropdown :: D.NutWith Types.Wires
midiOutputDropdown wires =
  DD.div
    -- Automatically request MIDI access on startup
    [ Self.self_ \_ -> runAff_ (setAccess wires) MIDI.requestAccess ]
    -- If no access...
    [ DH.guard (isNothing <$> wires.midiAccess) $
        -- Display a button to try requesting MIDI access again
        DD.button
          [ DL.click_ \_ -> runAff_ (setAccess wires) MIDI.requestAccess ]
          [ DD.text_ "No MIDI access. Try again" ]
    -- If we have MIDI access...
    , DH.guard (not <<< isNothing <$> wires.midiAccess) $
        -- Display the list of available outputs
        DD.select
          [ DL.change $ midiOutputSelectionCallback wires <$> wires.midiAccess ]
          [ midiOutputEntries wires ]
    ]


setAccess :: forall error
           . Types.Wires
          -> Either error (Maybe MIDI.Access)
          -> Effect Unit
setAccess wires eitherMaybeAccess = do
  -- All the combinators in this function are here to deal with Maybes.
  -- Remove them, and you pretty much have the non-Maybe version
  let maybeAccess = eitherMaybeAccess # hush # join
  -- Set MIDI access:
  wires.setMidiAccess maybeAccess
  -- Set MIDI output to be the first output on the list, if any:
  let firstID = maybeAccess <#> MIDI.outputIDs <#> head # join
  let firstOutput = MIDI.getOutput <$> maybeAccess <*> firstID # join
  wires.updateMidiOutput.push firstOutput


midiOutputSelectionCallback :: Types.Wires
                            -> Maybe MIDI.Access
                            -> Event.Event
                            -> Effect Unit
midiOutputSelectionCallback wires maybeAccess event = do
  let maybeElement = Event.target event >>= Select.fromEventTarget
  case (maybeElement /\ maybeAccess) of
    (Just elt /\ Just access) -> do
      outputID <- Select.value elt
      wires.updateMidiOutput.push $ MIDI.getOutput access outputID
    _ -> pure unit


midiOutputEntries :: D.NutWith Types.Wires
midiOutputEntries wires = wires.midiAccess <#~> case _ of
  Nothing -> mempty
  Just access -> D.fixed $ MIDI.outputIDs access <#> \id ->
    case MIDI.getOutput access id of
      Nothing     -> mempty
      Just output -> DD.option
                       [ DA.value_ id ]
                       [ DD.text_ $ MIDI.outputName output]

--------------------------------------------------------------------------------
