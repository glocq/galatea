module Types ( PitchRange, defaultPitchRange
             , Settings  , defaultSettings
             ) where


type PitchRange = { low  :: Number
                  , high :: Number
                  }

defaultPitchRange :: PitchRange
defaultPitchRange = { low:  57.0
                    , high: 81.0
                    }

type Settings = { blackKeyRatio :: Number -- The size of a black key compared to that of a semitone
                , pitchRange    :: PitchRange
                }

defaultSettings :: Settings
defaultSettings = { blackKeyRatio: 0.8
                  , pitchRange:    defaultPitchRange
                  }
