module WebMidi
  ( Access, Output, Message
  , requestAccess, getOutput, outputIDs, outputName, sendMessage
  , noteOn, noteOff, pitchBend, pitchBend', aftertouch, cc
  ) where

import Prelude
import Data.Int        (round, toNumber)
import Data.Maybe      (Maybe(Just, Nothing), fromMaybe)
import Effect          (Effect)
import Effect.Aff      (Aff)
import Control.Promise (Promise, toAffE)


-- Types

foreign import data Access :: Type
foreign import data Output :: Type

newtype Message = Message (Array Int)

instance showMessage :: Show Message where
  show (Message array) = "Message " <> show array

-- Functions

foreign import requestAccessImpl ::
  (forall a. a -> Maybe a) -> -- Just
  (forall a.      Maybe a) -> -- Nothing
  Effect (Promise (Maybe Access))


requestAccess :: Aff (Maybe Access)
requestAccess = toAffE $ requestAccessImpl Just Nothing


foreign import getOutputImpl ::
  (forall a. a -> Maybe a) -> -- Just
  (forall a.      Maybe a) -> -- Nothing
  Access -> String -> Maybe Output

getOutput :: Access -> String -> Maybe Output
getOutput = getOutputImpl Just Nothing


foreign import outputIDs   :: Access -> Array String
foreign import outputName  :: Output -> String
foreign import sendMessage :: Output -> Message -> Effect Unit


-------------------
-- MIDI messages --
-------------------

-- | NoteOn message to specified channel.
-- | The velocity value is between 0.0 and 1.0
noteOn :: Int -> Int -> Number -> Message
noteOn channel note velocity =
  Message [ 144 + channel
          , note
          , toIntRange 127 velocity
          ]

-- | NoteOff message to specified channel.
noteOff :: Int -> Int -> Maybe Number -> Message
noteOff channel note velocity =
  Message [ 144 + channel
          , note
          , toIntRange 127 (fromMaybe 0.0 velocity)
          ]

-- | Pitch bend message to specified channel.
-- | The pitch bend value is expected to be between -1.0 and 1.0.
pitchBend :: Int -> Number -> Message
pitchBend channel value = do
  let normalizedValue = toIntRange 16_383 $ (value + 1.0) / 2.0
  let msb = normalizedValue `div` 128 -- most significant bit
  let lsb = normalizedValue `mod` 128 -- least significant bit
  Message [224 + channel, lsb, msb]

-- | A convenience function where you specify the pitch bend value in semitones.
pitchBend' :: Number -> Int -> Number -> Message
pitchBend' halfRange channel semitones = pitchBend channel rescaledValue
  where rescaledValue = case halfRange of
          0.0 -> 0.0
          _   -> semitones / halfRange

-- | Aftertouch message to specified channel.
-- | The aftertouch value is expected to be between 0.0 and 1.0.
aftertouch :: Int -> Number -> Message
aftertouch channel value =
  Message [ 208 + channel
          , toIntRange 127 value
          ]

-- | MIDI CC message. First argument is the MIDI channel, second argument is
-- | the CC number. Third argument is the value, between 0.0 and 1.0. If the
-- | CC type has an associated LSB message, it is sent alongside.
-- | Warning: does not check for invalid channel or CC number.
cc :: Int -> Int -> Number -> Array Message
cc channel ccType value = do
  let normalizedValue = toIntRange 16_383 value
  let msb = normalizedValue `div` 128 -- most significant bit
  let lsb = normalizedValue `mod` 128 -- least significant bit
  if ccType <= 31 then [ Message [176 + channel, ccType     , msb]
                       , Message [176 + channel, ccType + 32, lsb]
                       ]
                  else [ Message [176 + channel, ccType     , msb] ]

toIntRange :: Int -> Number -> Int
toIntRange n = clamp 0 n <<< round <<< mul (toNumber n)
