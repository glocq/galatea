module WebMidi
  ( Access, Output, Message
  , requestAccess, getOutput, outputIDs, outputName, sendMessage
  , noteOn, noteOff
  ) where

import Prelude
import Effect          (Effect)
import Effect.Aff      (Aff)
import Control.Promise (Promise, toAffE)
import Data.Maybe      (Maybe(Just, Nothing))


-- Types

foreign import data Access :: Type
foreign import data Output :: Type

newtype Message = Message (Array Int)


-- Functions

foreign import requestAccessImpl ::
  (forall a. a -> Maybe a) -> -- Just
  (forall a.      Maybe a) -> -- Nothing
  Effect (Promise (Maybe Access))

-- Warning: this function can only be used in a "secure" setting!
-- TODO fail gracefully if not secure
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


-- MIDI messages

noteOn :: Int -> Int -> Int -> Message
noteOn note channel velocity = Message [144 + channel, note, velocity]

noteOff :: Int -> Int -> Message
noteOff note channel = Message [144 + channel, note, 0]
