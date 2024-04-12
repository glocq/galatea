module MidiEmitter (component) where

-- General-purpose modules
import Prelude
import Data.Int                (round, toNumber)
import Data.Maybe              (Maybe(..))
import Data.Tuple.Nested       ((/\))
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



type PlayingState = { currentNote :: Maybe Int }

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
component :: D.NutWith Types.Wires
component wires = Deku.do
  DD.div
    -- Subscribe to pointer events at element creation:
    [ Self.self $ const <$> (initialize wires.surfaceOut.event
                                    <$> wires.settings
                                    <*> wires.midiOutput)
    , DA.id_ "midiEmitter"
    ] []



initialize :: Event.Event Types.SurfaceMsg
           -> Types.Settings
           -> Maybe MIDI.Output
           -> Effect Unit
initialize surfaceEvent settings output = do
  stateRef <- toEffect $ new {currentNote: Nothing} -- we store internal state in a ST reference
  void $ toEffect $
    Event.subscribe surfaceEvent $ surfaceMsgCallback settings output stateRef



maybeSendMidi :: Maybe MIDI.Output -> MIDI.Message -> Effect Unit
maybeSendMidi maybeOutput msg = case maybeOutput of
  Nothing -> log $ "No MIDI output found to send message " <> show msg
  Just output -> MIDI.sendMessage output msg



surfaceMsgCallback :: Types.Settings
                   -> Maybe MIDI.Output
                   -> STRef Global PlayingState
                   -> Types.SurfaceMsg
                   -> Effect Unit
surfaceMsgCallback settings output ref msg = do

  -- First we'll determine how to convert from normalized position on
  -- the control to pitch value (in MIDI semitones):
  let toPitch x = if settings.leftPitch == settings.rightPitch
    -- A pretty specific edge case, to avoid dividing by zero:
    then settings.leftPitch
    -- Otherwise we just interpolate between the left and right edges:
    else settings.leftPitch + x * (settings.rightPitch - settings.leftPitch)

  -- Get hold of current internal state:
  oldState <- toEffect $ read ref


  -- We need this big case expression to deal with the numerous situations
  -- that can arise depending on whether the pointer was just put in/out of contact/moved,
  -- and whether a note was already playing. There is probably a way to reduce
  -- code duplication here?
  case (oldState.currentNote /\ msg) of

    -- No note was playing, and the pointer was not put in contact: do nothing:
    (Nothing /\ Types.Stop _) -> pure unit
    (Nothing /\ Types.Move _) -> pure unit

    -- Pointer was put in contact while we were not playing:
    (Nothing /\ Types.Start properties) -> do
      let pitch = toPitch properties.x
      -- Determine closest whole pitch value:
      let newNote = round pitch
      -- Update state: a note is now playing:
      _ <- toEffect $ write {currentNote: Just newNote} ref
      -- Send NoteOn, pitch bend and aftertouch messages accordingly:
      maybeSendMidi output $ MIDI.noteOn settings.midiChannel newNote properties.pressure
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber newNote
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure

    -- Pointer moved while we were playing: no NoteOn, but update pitch bend
    -- and aftertouch:
    (Just note /\ Types.Move properties) -> do
      let pitch = toPitch properties.x
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber note
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure

    -- A note was playing, and the pointer was pressed again:
    -- This should not have happened, we'll just pretend the pointer moved
    -- instead of being put in contact again, so we do the same as above:
    (Just note /\ Types.Start properties) -> do
      let pitch = toPitch properties.x
      maybeSendMidi output $ MIDI.pitchBend' settings.pitchBendHalfRange settings.midiChannel $ pitch - toNumber note
      maybeSendMidi output $ MIDI.aftertouch settings.midiChannel properties.pressure

    -- A note was playing, and the pointer was put out of contact:
    -- stop the note by sending a NoteOff, and update internal state so we know
    -- we're not playing anymore:
    (Just note /\ Types.Stop _) -> do
      _ <- toEffect $ write {currentNote: Nothing} ref
      maybeSendMidi output $ MIDI.noteOff settings.midiChannel note Nothing
