module Style where

import Prelude
import Color        as Color
import Deku.CSS     as DC
import CSS          as CSS
import CSS.Common   as CSSC
import Types        as Types



inputStyle :: CSS.StyleM Unit
inputStyle = do
  CSS.display CSS.inline
  CSS.marginLeft $ CSS.px 10.0

inputStyleStr :: String
inputStyleStr = DC.render inputStyle


settingsContainerStyle :: String
settingsContainerStyle =
  "gap: 10px;" <>
  DC.render do
    CSS.display CSS.flex
    CSS.flexDirection CSS.column
    CSS.alignItems CSSC.center
    CSS.marginTop $ CSS.px 10.0


fullscreenButtonStyle :: String
fullscreenButtonStyle = DC.render do
  CSS.fontSize      $ CSS.px 18.0
  CSS.paddingTop    $ CSS.px  7.0
  CSS.paddingBottom $ CSS.px  7.0
  CSS.paddingLeft   $ CSS.px 14.0
  CSS.paddingRight  $ CSS.px 14.0
  CSS.marginTop     $ CSS.px 20.0
  CSS.marginBottom  $ CSS.px 20.0


modeSwitcherStyle :: String
modeSwitcherStyle = DC.render do
  CSS.marginBottom $ CSS.px 20.0

modeButtonStyle :: Types.Mode -> Types.Settings -> String
modeButtonStyle mode settings =
  "border: none;" <>
  DC.render do
    CSS.fontSize $ CSS.px 18.0
    CSS.paddingTop    $ CSS.px  7.0
    CSS.paddingBottom $ CSS.px  7.0
    CSS.paddingLeft   $ CSS.px 14.0
    CSS.paddingRight  $ CSS.px 14.0
    -- Change style depending on whether current mode or not:
    if settings.mode == mode
      then do
        CSS.backgroundColor $ Color.rgb' 0.1 0.1 0.6
        CSS.color $ Color.white
      else do
        CSS.backgroundColor $ Color.graytone 0.9
        CSS.color $ Color.black


ccDropdownGroupStyle :: Types.Settings -> String
ccDropdownGroupStyle settings =
  "gap: 10px;" <>
  DC.render do
    case settings.mode of
      Types.Instrument -> CSS.display CSS.displayNone
      Types.CC         -> CSS.display CSS.flex
    CSS.flexDirection CSS.column
    CSS.alignItems CSSC.center

ccDropdownStyle :: String
ccDropdownStyle = DC.render do
  inputStyle
  CSS.width $ CSS.px 150.0


pitchBendHalfRangeInputStyle :: Types.Settings -> String
pitchBendHalfRangeInputStyle settings = DC.render $ case settings.mode of
  Types.Instrument -> pure unit
  Types.CC         -> CSS.display CSS.displayNone


midiOutputDropdownStyle :: String
midiOutputDropdownStyle = DC.render do
  CSS.marginTop    $ CSS.px 20.0
  CSS.marginBottom $ CSS.px 20.0
