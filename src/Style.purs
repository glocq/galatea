module Style where

import Prelude
import Data.NonEmpty (NonEmpty(..))
import Color         as Color
import Deku.CSS      as DC
import CSS           as CSS
import CSS.Common    as CSSC
import CSS.TextAlign as CT
import CSS.FontStyle as CF
import Types         as Types



textStyle' :: CSS.StyleM Unit
textStyle' = CSS.fontFamily [] $ NonEmpty CSS.sansSerif []

textStyle :: String
textStyle = DC.render textStyle'

inputStyle' :: CSS.StyleM Unit
inputStyle' = do
  textStyle'
  CSS.display CSS.inline
  CSS.marginLeft $ CSS.px 10.0

inputStyle :: String
inputStyle = DC.render inputStyle'


titleStyle :: String
titleStyle = DC.render do
  textStyle'
  CT.textAlign CT.center
  CSS.marginTop    $ CSS.px 50.0
  CSS.marginBottom $ CSS.px 30.0

subtitleStyle :: String
subtitleStyle = DC.render do
  textStyle'
  CT.textAlign CT.center
  CF.fontStyle CF.italic
  CSS.marginBottom $ CSS.px 30.0


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
  textStyle'
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
    textStyle'
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
    textStyle'
    CSS.flexDirection CSS.column
    CSS.alignItems CSSC.center

ccDropdownStyle :: String
ccDropdownStyle = DC.render do
  inputStyle'
  CSS.width $ CSS.px 150.0


pitchBendHalfRangeInputStyle :: Types.Settings -> String
pitchBendHalfRangeInputStyle settings = DC.render $ case settings.mode of
  Types.Instrument -> pure unit
  Types.CC         -> do
    textStyle'
    CSS.display CSS.displayNone


midiOutputDropdownStyle :: String
midiOutputDropdownStyle = DC.render do
  textStyle'
  CSS.marginTop    $ CSS.px 20.0
  CSS.marginBottom $ CSS.px 20.0
