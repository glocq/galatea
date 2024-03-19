module MidiHub (component, Query(SendMidi), Slot) where

-- General-purpose modules
import Prelude
import Data.Maybe       (Maybe(Nothing, Just))
import Data.Array       (head, elem)
import Effect.Class     (class MonadEffect)
import Effect.Aff.Class (class MonadAff)
-- Halogen modules
import Halogen                 as H
import Halogen.HTML            as HTML
import Halogen.HTML.Events     as HTML.Ev
import Halogen.HTML.Properties as HTML.Prop
-- Local module
import WebMidi                 as MIDI


-- This Halogen component serves as an interface for applications to interact
-- with the Web MIDI API. In particular, it deals with the matter of requesting
-- access to the Web MIDI API.
-- Its GUI consists of:
--   * A button to refresh MIDI (i.e. re-request access to the Web MIDI API),
--   * A dropdown menu to select a specific MIDI output.
-- When queried with a MIDI message, it sends it out to the selected output, and
-- returns a flag indicating whether the operation was successful.


-- Request access to Web MIDI API, or select a certain MIDI output by ID.
data Action = GetAccess | SetOutput String

-- Nothing if no access to the Web MIDI API granted.
-- Even if access was granted, no output could be selected, hence the wrapping
-- of the current output ID in a Maybe.
type State = Maybe { access          :: MIDI.Access
                   , currentOutputID :: Maybe String
                   }

-- The one available query is a request to send a given MIDI message.
-- A boolean flag indicating success/failure is returned.
-- (This type looks weird, but it's just a quirk of the Halogen library)
data Query a = SendMidi MIDI.Message (Boolean -> a)

-- Just a helper type for parent components
type Slot id = H.Slot Query Void id


component :: forall input output m. MonadAff m
          => H.Component Query input output m
component = H.mkComponent
  { initialState: \_ -> Nothing -- Access to the Web MIDI API will be requested as an initialization action. No access for now.
  , render: render
  , eval: H.mkEval $ H.defaultEval
            { initialize   = Just GetAccess -- Request Web MIDI API access as early as possible:
            , handleQuery  = handleQuery
            , handleAction = handleAction
            }
  }
  where
  render :: forall w. State -> HTML.HTML w Action
  render state =
    HTML.div [ HTML.Prop.id "midi" ]
      -- Status indicator
      [ HTML.text $ case state of
          Nothing -> "No MIDI access"
          Just st -> case st.currentOutputID of
            Nothing -> "No MIDI output selected"
            Just id -> case MIDI.getOutput st.access id of
              Nothing     -> "Error: Invalid MIDI output selected"
              Just output -> "Current MIDI output: " <> MIDI.outputName output
      -- Button to request access to the Web MIDI API
      , HTML.button
          [ HTML.Ev.onClick \_ -> GetAccess ]
          [ HTML.text "Refresh MIDI Outputs" ]
      -- Dropdown list of available MIDI outputs
      , HTML.select
          [ HTML.Ev.onValueChange \value -> SetOutput value ] $
        case state of
            Nothing -> []
            Just st -> map (toOption st.access) $ MIDI.outputIDs st.access
      ]
    where
    -- Individual elements in the dropdown list
    toOption access id =
      HTML.option
        [ HTML.Prop.value id ]
        [ HTML.text $ case MIDI.getOutput access id of
            Nothing -> "Invalid MIDI Output"
            Just x  -> MIDI.outputName x
        ]


handleQuery :: forall action output a m. MonadEffect m
            => Query a -> H.HalogenM State action () output m (Maybe a)
handleQuery (SendMidi msg reply) = do
  maybeOutput <- H.gets midiOutput
  case maybeOutput of
    -- Failure: no available MIDI output
    Nothing -> pure $ Just (reply false)
    -- Success
    Just output -> do
      H.liftEffect $ MIDI.sendMessage output msg
      pure $ Just (reply true)



handleAction :: forall output m. MonadAff m
             => Action -> H.HalogenM State Action () output m Unit
handleAction = case _ of

  -- Triggered at setup, or when the user clicks the refresh button
  GetAccess -> do
    -- Attempt to get MIDI access
    maybeAccess <- H.liftAff MIDI.requestAccess
    case maybeAccess of
      -- Failure:
      Nothing -> H.modify_ \_ -> Nothing
      -- Success:
      Just access -> H.modify_ $ newAccess access
      where
      -- Register new MIDI access, but keep former selected MIDI output
      -- if it is still available:
      newAccess :: MIDI.Access -> State -> State
      newAccess access state = Just
        { access: access
        , currentOutputID: case state of
            Nothing -> defaultOutput -- No previous MIDI access, so no output previously selected
            Just st -> case st.currentOutputID of
              Nothing -> defaultOutput -- No output previously selected
              Just id -> if elem id (MIDI.outputIDs st.access)
                then Just id       -- Previous output is still available! We use it
                else defaultOutput -- Previous output disappeared, using the default one
        }
        -- Just use the first available output by default:
        where defaultOutput = head $ MIDI.outputIDs access

  -- Triggered when the user selects a certain MIDI output in the dropdown list
  SetOutput id ->
    H.modify_ \state -> case state of
      Nothing -> Nothing
      Just st -> Just $ st { currentOutputID = Just id }


-- Get current output (not just the output ID)
midiOutput :: State -> Maybe MIDI.Output
midiOutput Nothing = Nothing
midiOutput (Just st) = case st.currentOutputID of
  Nothing -> Nothing
  Just id -> MIDI.getOutput st.access id
