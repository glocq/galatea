module MidiEmitter (component) where

-- General-purpose modules
import Prelude
import Data.Int                (round, toNumber)
import Data.Maybe              (Maybe(..))
import Data.Tuple.Nested       (type (/\), (/\))
import Control.Monad.ST        (ST)
import Control.Monad.ST.Ref    (STRef, new, read, write)
import Control.Monad.ST.Global (Global, toEffect)
import Effect                  (Effect)
import Effect.Class.Console    (log)
-- Deku-related modules
import Deku.Core           as D
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA
import Deku.DOM.Self       as Self
import FRP.Event           as Event
-- Local modules
import Types   as Types
import WebMidi as MIDI




-- | This "MIDI emitter" is a sink for messages coming from the control surface,
-- | and outputs MIDI messages based on those.
-- | It shows up as an empty `<div>` in the DOM.
-- | I made this because the logic of turning pointer events into MIDI data is
-- | slightly complex and involves both internal state and settings lookup
-- | (in addition to pointer input), so it seemed wiser to separate that logic
-- | into a separate component.
-- | There is probably a more elegant way to do that while keeping concerns
-- | separated, using polls. I'll wait until I'm more seasoned in Deku to
-- | revisit this.
component :: ST Global (D.NutWith Types.Wires)
component = do

  -- We use the ST monad to keep track of some state, because I had problems
  -- mixing subscriptions with polls.
  playingStateRef <- new defaultPlayingState
  midiOutputRef   <- new Nothing
  outputUpdateSubscriptionRef <- new $ pure unit
  surfaceSubscriptionRef      <- new $ pure unit

  pure $ \wires -> DD.div
    [ DA.id_ "midiEmitter"
    -- Subscribe to MIDI output updates at element creation:
    , Self.self_ $ const  $ subscribeToOutputUpdates wires
                                                     surfaceSubscriptionRef
                                                     midiOutputRef
    -- Subscribe to pointer events at element creation:
    , Self.self $ const <$> subscribeToSurfaceEvents wires
                                                     outputUpdateSubscriptionRef
                                                     playingStateRef
                                                     midiOutputRef <$>
                                                     wires.settings
    ] []



type PlayingState = { currentNote :: Maybe Int }

defaultPlayingState :: PlayingState
defaultPlayingState = { currentNote: Nothing }




-----------------------------------------------
-- Subscriptions to make upon initialization --
-----------------------------------------------

subscribeToOutputUpdates :: Types.Wires
                         -> STRef Global (ST Global Unit)
                         -> STRef Global (Maybe MIDI.Output)
                         -> Effect Unit
subscribeToOutputUpdates wires subscriptionRef outputRef = do
  -- Get former subscription from reference:
  formerSubscription <- toEffect $ read subscriptionRef
  -- Actually unsubscribe:
  toEffect formerSubscription
  -- Make a new subscription:
  newSubscription <- toEffect $ Event.subscribe wires.updateMidiOutput.event $
    \output -> toEffect $ void $ write output outputRef
  -- Store subscription for the when we'll want to unsubscribe:
  void $ toEffect $ write newSubscription subscriptionRef


subscribeToSurfaceEvents :: Types.Wires
                         -> STRef Global (ST Global Unit)
                         -> STRef Global (PlayingState)
                         -> STRef Global (Maybe MIDI.Output)
                         -> Types.Settings
                         -> Effect Unit
subscribeToSurfaceEvents wires subscriptionRef stateRef outputRef settings = do
  -- Get former subscription from reference:
  formerSubscription <- toEffect $ read subscriptionRef
  -- Actually unsubscribe:
  toEffect formerSubscription
  -- Make a new subscription:
  newSubscription <- toEffect $ Event.subscribe wires.surfaceOut.event $
    \message -> do
      oldState <- toEffect $ read stateRef
      output   <- toEffect $ read outputRef
      newState <- surfaceMsgCallback output
                                     oldState
                                     settings
                                     wires.setPitchBendLimits
                                     message
      _ <- toEffect $ write newState stateRef
      pure unit
  -- Store subscription for the when we'll want to unsubscribe:
  void $ toEffect $ write newSubscription subscriptionRef




----------------------------------------------------
-- Dealing with messages from the control surface --
----------------------------------------------------


surfaceMsgCallback :: Maybe MIDI.Output
                   -> PlayingState
                   -> Types.Settings
                   -> (Maybe (Number /\ Number) -> Effect Unit)
                   -> Types.SurfaceMsg
                   -> Effect PlayingState
surfaceMsgCallback output state settings setLimits msg = do

  -- First we'll determine how to convert from normalized position on
  -- the control to pitch value (in MIDI semitones):
  let toPitch x = if settings.leftPitch == settings.rightPitch
    -- A pretty specific edge case, to avoid dividing by zero:
    then settings.leftPitch
    -- Otherwise we just interpolate between the left and right edges:
    else settings.leftPitch + x * (settings.rightPitch - settings.leftPitch)


  -- We need this big case expression to deal with the numerous situations
  -- that can arise depending on whether the pointer was just put in/out of contact/moved,
  -- and whether a note was already playing. There is probably a way to reduce
  -- code duplication here?
  newState <- case (state.currentNote /\ msg) of

    -- No note was playing, and the pointer was not put in contact: do nothing:
    (Nothing /\ Types.Stop _) -> pure {currentNote: Nothing}
    (Nothing /\ Types.Move _) -> pure {currentNote: Nothing}

    -- Pointer was put in contact while we were not playing:
    (Nothing /\ Types.Start properties) -> do
      let pitch = toPitch properties.x
      -- Determine closest whole pitch value:
      let newNote = round pitch
      -- Send NoteOn, pitch bend and aftertouch messages accordingly:
      maybeSendMidi output $ MIDI.noteOn settings.midiChannel newNote properties.pressure
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber newNote
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure
      -- A note is now playing:
      pure {currentNote: Just newNote}

    -- Pointer moved while we were playing: no NoteOn, but update pitch bend
    -- and aftertouch:
    (Just note /\ Types.Move properties) -> do
      let pitch = toPitch properties.x
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber note
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure
      -- Same note is still playing:
      pure {currentNote: Just note}

    -- A note was playing, and the pointer was pressed again:
    -- This should not have happened, we'll just pretend the pointer moved
    -- instead of being put in contact again, so we do the same as above:
    (Just note /\ Types.Start properties) -> do
      let pitch = toPitch properties.x
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber note
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure
      -- Same note is still playing:
      pure {currentNote: Just note}

    -- A note was playing, and the pointer was put out of contact:
    -- stop the note by sending a NoteOff, and update internal state so we know
    -- we're not playing anymore:
    (Just note /\ Types.Stop _) -> do
      maybeSendMidi output $ MIDI.noteOff settings.midiChannel note Nothing
      -- No note is playing anymore
      pure {currentNote: Nothing}


  -- Tell control surface to display pitch bend limits
  setLimits $ allowedRange settings newState
  -- Return current playing state
  pure newState



-- | Helper function for the above. Sends a MIDI message through the specified
-- | output if any, otherwise displays it in the console.
maybeSendMidi :: Maybe MIDI.Output -> MIDI.Message -> Effect Unit
maybeSendMidi maybeOutput msg = case maybeOutput of
  Nothing -> log $ "No MIDI output found to send message " <> show msg
  Just output -> MIDI.sendMessage output msg

-- | A helper function that outputs the limits, in control surface coordinates,
-- | outside of which pitch bend will stop working
allowedRange :: Types.Settings -> PlayingState -> Maybe (Number /\ Number)
allowedRange settings state = case state.currentNote of
  Nothing -> Nothing
  Just note -> case settings.rightPitch - settings.leftPitch of
    0.0 -> Nothing -- if the whole surface is just one note, everywhere is allowed
    _ -> do
      let displayedRange = settings.rightPitch - settings.leftPitch
      let lim1Semitone = toNumber note - settings.pitchBendHalfRange
      let lim2Semitone = toNumber note + settings.pitchBendHalfRange
      let lim1 = (lim1Semitone - settings.leftPitch) / displayedRange
      let lim2 = (lim2Semitone - settings.leftPitch) / displayedRange
      if lim1 <= lim2 then Just (lim1 /\ lim2)
                      else Just (lim2 /\ lim1)
