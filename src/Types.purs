module Types ( PitchRange
             , defaultPitchRange
             ) where


type PitchRange = { low  :: Number
                  , high :: Number
                  }

defaultPitchRange :: PitchRange
defaultPitchRange = { low:  57.0
                    , high: 81.0
                    }
