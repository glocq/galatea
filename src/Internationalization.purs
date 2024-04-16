module Internationalization where

import Prelude
import Deku.Core           as D
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA


data Language = English | French

currentLanguage :: Language
currentLanguage = English


bottomText :: D.Nut
bottomText = case currentLanguage of
  English -> DD.text_ "Made with love by "                          <>
             DD.a [DA.href_ "https://glocq.github.io/en/"]
                  [DD.text_ "Grégoire Locqueville"]                 <>
             DD.text_ ". Source code and documentation available "  <>
             DD.a [DA.href_ "https://github.com/glocq/galatea"]
                  [DD.text_ "on Github"]                            <>
             DD.text_ "."
  French  -> DD.text_ "Fait avec amour par "                        <>
             DD.a [DA.href_ "https://glocq.github.io/"]
                  [DD.text_ "Grégoire Locqueville"]                 <>
             DD.text_ ". Code source et documentation disponibles " <>
             DD.a [DA.href_ "https://github.com/glocq/galatea"]
                  [DD.text_ "sur Github"]                           <>
             DD.text_ "."


setFullscreen :: String
setFullscreen = case currentLanguage of
  English -> "Set Fullscreen"
  French  -> "Passer en plein écran"

instrumentMode :: String
instrumentMode = case currentLanguage of
  English -> "Instrument Mode"
  French  -> "Mode instrument"

ccMode :: String
ccMode = case currentLanguage of
  English -> "Controller (CC) Mode"
  French  -> "Mode contrôleur (CC)"

leftPitchInputLabel :: String
leftPitchInputLabel = case currentLanguage of
  English -> "Left Pitch (MIDI semitones):"
  French  -> "Hauteur à gauche (demi-tons MIDI) :"

rightPitchInputLabel :: String
rightPitchInputLabel = case currentLanguage of
  English -> "Right Pitch (MIDI semitones):"
  French  -> "Hauteur à droite (demi-tons MIDI) :"

midiChannelInputLabel :: String
midiChannelInputLabel = case currentLanguage of
  English -> "MIDI Channel:"
  French  -> "Canal MIDI :"

horizontalCCInputLabel :: String
horizontalCCInputLabel = case currentLanguage of
  English -> "Horizontal axis CC type:"
  French  -> "Message CC (axe horizontal) :"

verticalCCInputLabel :: String
verticalCCInputLabel = case currentLanguage of
  English -> "Vertical axis CC type:"
  French  -> "Message CC (axe vertical) :"

pressureCCInputLabel :: String
pressureCCInputLabel = case currentLanguage of
  English -> "Pressure CC type"
  French  -> "Message CC (pression)"

pitchBendHalfRangeInputLabel :: String
pitchBendHalfRangeInputLabel = case currentLanguage of
  English -> "Pitch Bend Half-Range (semitones):"
  French  -> "Demi-étendue de la plage de hauteur (demi-tons) :"

midiOutputDropdownLabel :: String
midiOutputDropdownLabel = case currentLanguage of
  English -> "MIDI output:"
  French  -> "Sortie MIDI :"

noMidiAccess :: String
noMidiAccess = case currentLanguage of
  English -> "No MIDI access. Try again"
  French  -> "Pas d'accès MIDI. Cliquer pour réessayer"
