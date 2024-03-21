module Types ( PitchRange, defaultPitchRange
             , Settings  , defaultSettings
             , MusicMessage (..)
             ) where


type PitchRange = { low  :: Number
                  , high :: Number
                  }

defaultPitchRange :: PitchRange
defaultPitchRange = { low:  57.0
                    , high: 81.0
                    }

type Settings = { blackKeyRatio      :: Number -- The size of a black key compared to that of a semitone
                , pitchRange         :: PitchRange
                , halfPitchBendRange :: Number
                }

defaultSettings :: Settings
defaultSettings = { blackKeyRatio:      0.8
                  , pitchRange:         defaultPitchRange
                  , halfPitchBendRange: 3.0
                  }

-- Like MIDI messages, but higher level
data MusicMessage = NoteOn Int Number -- MIDI semitone value; normalized velocity
                  | NoteOff
                  | PitchBend Number -- in semitones
                  | Intensity Number -- normalized between 0.1 and 1.0
