module ControlSurface (component, Slot) where

-- General-purpose modules
import Prelude
import Data.Maybe       (Maybe (..), fromJust)
import Data.Tuple       (Tuple (..))
import Data.Array       ((..))
import Data.Int         (floor, ceil, toNumber, round)
import Data.Traversable (for_)
import Data.Foldable    (elem)
import Data.Number      (pi, pow)
import Partial.Unsafe   (unsafePartial)
import Effect           (Effect)
import Effect.Class     (class MonadEffect, liftEffect)
-- Halogen and web-related modules
import Halogen                       as H
import Halogen.HTML                  as HTML
import CSS                           as CSS
import Halogen.Subscription          as H.Sub
import Web.PointerEvent.PointerEvent as Ptr
import Web.ResizeObserver            as Resize
import Color                         as Color
import Halogen.HTML.Properties    (ref)
import Halogen.HTML.Events        (handler)
import Halogen.HTML.CSS           (style)
import Web.Event.Event            (EventType (..))
import Web.Event.Internal.Types   (Event)
import Web.UIEvent.MouseEvent     (clientX, clientY)
import Web.DOM.Element            (getBoundingClientRect)
import Web.HTML.HTMLElement       (toElement)
import Web.HTML.HTMLCanvasElement (HTMLCanvasElement, fromHTMLElement)
-- Local modules
import Types  as Types
import Canvas as Canvas

-- This Halogen component is where the user uses their pointer to produce
-- MIDI events. It is composed of three stacked canvases in a div, each of which
-- displays something different. The topmost canvas is in charge of receiving
-- the pointer events.
-- * The background canvas displays a piano-like mask, with a vertical line for
--   each note, so musicians know to map between position and pitch. Updated on
--   every resize.
-- * The middle canvas displays a greyed out double area where pitch is constant
--   due to pitch bend limitations. Updated every time a note starts or ends.
-- * The top canvas displays an indicator about the position and pressure of the
--   pointer.
--
-- Notes:
-- - Work in progress ! Only the background canvas for now; display does not work
--   yet, and pointer events are not dealt with yet.
-- - Lots of partial functions here. That's because we do a lot of conversion
--   between various types of elements (e.g. from an element which we know is a
--   canvas to a canvas element) and fetching elements by `RefLabel`.
--   I'm confident that those operations won't fail, and pattern matching on the
--   unsuccessful cases wouldn't catch the errors --- just show a more informative
--   error message, at the price of significantly polluting the already busy code.



{- The component -}

component :: forall query m. MonadEffect m
          => H.Component query Types.Settings Types.MusicMessage m
component = unsafePartial $ H.mkComponent
  { initialState: \input -> { height:       0.0 -- will be updated at initialization
                            , width:        0.0 -- based on actual dimensions
                            , settings:     input
                            , pointerState: defaultPointerState
                            , musicState:   Nothing -- no note playing
                            }
  , render: render
  , eval: H.mkEval $ H.defaultEval 
            { initialize   = Just Initialize
            , handleAction = handleAction
            }
  }


{- Types -}

type ControlSurfaceM = H.HalogenM State Action () Types.MusicMessage

type Input = {}

type State = { height       :: Number
             , width        :: Number
             , settings     :: Types.Settings
             , pointerState :: PointerState
             , musicState   :: MusicState
             }

type PointerState = { contact  :: Boolean -- True iff pointer is in contact
                    , x        :: Number
                    , y        :: Number
                    , pressure :: Number -- Normalized pressure between 0.0 and 1.0
                    }

defaultPointerState :: PointerState
defaultPointerState = { contact:  false
                      , x:        0.0
                      , y:        0.0
                      , pressure: 0.0
                      }

-- Nothing if no note is playing, Just baseNote if a NoteOn was sent
-- with MIDI pitch baseNote
type MusicState = Maybe { basePitch :: Int }


data Action = Initialize
            | Resize Number Number
            | PaintBackground
            | PaintPointer
            | PaintLimits
            -- Pointer events
            | PointerDown Event
            | PointerUp   Event
            | PointerMove Event
            -- Compare pointer state to former music state,
            -- output MIDI if necessary, and update music state:
            | MusicUpdate

type Slot id = forall query. H.Slot query Types.MusicMessage id -- just a helper type for parents



{- Helper functions -}

-- Our component is based on three stacked canvases (so that each can be updated
-- independently for performance reasons. This might be overkill):
-- - The background canvas is a piano-like display for the musician to know
--   where notes are.
-- - The middle canvas displays pitch limits, so they understand why pitch
--   becomes constant when they deviate from the base note too much.
-- - The foreground canvas displays an indicator where the pointer is, which
--   changes appearance based on pressure.

render :: forall w. State -> HTML.HTML w Action
render _ =
  HTML.div
    [ ref $ H.RefLabel "controlSurface"
    , style $ do
        CSS.height $ CSS.pct 100.0
        CSS.width  $ CSS.pct 100.0
        CSS.border CSS.solid (CSS.px 1.0) CSS.black
        CSS.position CSS.relative
    ]
    [ HTML.canvas
        [ ref backgroundCanvasID
        , style $ layerProperties 0
        ]
    , HTML.canvas
        [ ref pitchRangeCanvasID
        , style $ layerProperties 1
        ]
    , HTML.canvas
        [ handler (EventType "pointerdown") PointerDown
        , handler (EventType "pointerup"  ) PointerUp
        , handler (EventType "pointermove") PointerMove
        , ref pointerCanvasID
        , style $ layerProperties 2
        ]
    ]


backgroundCanvasID :: H.RefLabel
backgroundCanvasID = H.RefLabel "backgroundCanvas"

pitchRangeCanvasID :: H.RefLabel
pitchRangeCanvasID = H.RefLabel "pitchRangeCanvas"

pointerCanvasID :: H.RefLabel
pointerCanvasID = H.RefLabel "pointerCanvas"



initialize :: forall m. Partial => MonadEffect m
           => ControlSurfaceM m Unit
initialize = do
  resizedEmitter <- newResizedEmitter resizedCallback
  _ <- H.subscribe resizedEmitter
  pure unit




handleAction :: forall m. Partial => MonadEffect m
             => Action -> ControlSurfaceM m Unit
handleAction = case _ of

  Initialize -> initialize

  Resize w h -> do
    H.modify_ $ \state -> state { height = h, width = w }
    maybeBackground   <- getCanvas backgroundCanvasID
    maybeMiddleground <- getCanvas pitchRangeCanvasID
    maybeForeground   <- getCanvas pointerCanvasID
    for_ maybeBackground   $ \background   -> liftEffect $ do
      Canvas.setWidth  background w
      Canvas.setHeight background h
    for_ maybeMiddleground $ \middleground -> liftEffect $ do
      Canvas.setWidth  middleground w
      Canvas.setHeight middleground h
    for_ maybeForeground   $ \foreground   -> liftEffect $ do
      Canvas.setWidth  foreground w
      Canvas.setHeight foreground h
    handleAction PaintBackground

  PaintBackground -> paintOnCanvas paintBackground backgroundCanvasID
  PaintLimits     -> paintOnCanvas paintLimits     pitchRangeCanvasID
  PaintPointer    -> paintOnCanvas paintPointer    pointerCanvasID

  PointerDown event -> do
    let ptrEv = fromJust $ Ptr.fromEvent event
    canvasRect <- (liftEffect <<< getBoundingClientRect <<< toElement) =<<
                  (fromJust <$> H.getHTMLElementRef pointerCanvasID)
    let x = (toNumber $ clientX $ Ptr.toMouseEvent ptrEv) - canvasRect.left
    let y = (toNumber $ clientY $ Ptr.toMouseEvent ptrEv) - canvasRect.top
    H.modify_ \state -> do
      state { pointerState { contact  = true
                           , x = x
                           , y = y
                           , pressure = Ptr.pressure ptrEv
                           }
            }
    handleAction MusicUpdate
    handleAction PaintPointer
    handleAction PaintLimits

  PointerUp _ -> do
    H.modify_ \state -> state { pointerState { contact = false } }
    handleAction MusicUpdate
    handleAction PaintPointer
    handleAction PaintLimits

  PointerMove event -> do
    let ptrEv = fromJust $ Ptr.fromEvent event
    canvasRect <- (liftEffect <<< getBoundingClientRect <<< toElement) =<<
                  (fromJust <$> H.getHTMLElementRef pointerCanvasID)
    let x = (toNumber $ clientX $ Ptr.toMouseEvent ptrEv) - canvasRect.left
    let y = (toNumber $ clientY $ Ptr.toMouseEvent ptrEv) - canvasRect.top
    H.modify_ \state ->
      state { pointerState { x = x
                           , y = y
                           , pressure = Ptr.pressure ptrEv
                           }
            }
    handleAction MusicUpdate
    handleAction PaintPointer


  MusicUpdate -> do
    (state :: State) <- H.get
    -- If stylus is in contact, Just pitch, where pitch is the semitone value
    -- corresponding to the contact point. Otherwise, Nothing.
    let newPitch = if state.pointerState.contact
      then
        let lowPitch  = state.settings.pitchRange.low  in
        let highPitch = state.settings.pitchRange.high in
        let width = state.width                        in
        let x = state.pointerState.x                   in
        Just $ if lowPitch /= highPitch then (x / width) * (highPitch - lowPitch) + lowPitch
                                        else lowPitch
      else Nothing


    -- Four cases here:
    case Tuple state.musicState newPitch of

      -- 1. The pointer is not in contact and no note was being played:
      --    nothing to do here.
      Tuple Nothing Nothing -> pure unit

      -- 2. The pointer is in contact, but no note was being played:
      Tuple Nothing (Just pitch) -> do
        let closestNote = round pitch
        -- Update internal state: a note is now being played
        H.modify_ $ \_ -> state {musicState = Just {basePitch: closestNote}}
        -- Send music messages: a note is now to be played, but before that
        -- we set pitch bend and intensity control messages to their adequate value:
        H.raise $ Types.Intensity $ state.pointerState.pressure
        H.raise $ Types.PitchBend $ pitch - toNumber closestNote
        H.raise $ Types.NoteOn closestNote state.pointerState.pressure

      -- 3. A note was being played, but the pointer is no longer in contact:
      Tuple (Just _) Nothing -> do
        -- Update internal state: no note is being played anymore
        H.modify_ $ \_ -> state {musicState = Nothing}
        -- Send music message: stop playing note
        H.raise Types.NoteOff

      -- 4. A note was being played, and the pointer is still in contact:
      Tuple (Just ms) (Just currentPitch) -> do
        H.raise $ Types.Intensity $ state.pointerState.pressure
        H.raise $ Types.PitchBend $ currentPitch - toNumber ms.basePitch

    -- Update pitch limits canvas:
    handleAction PaintLimits




-- Creates a new resize observer that will emit a Resize action
-- upon resizes of this component's main div. See the javascript Resize API.
newResizedEmitter :: forall m. Partial => MonadEffect m
                  => (H.Sub.Listener Action -> Resize.ResizeObserverEntry -> Effect Unit)
                  -> ControlSurfaceM m (H.Sub.Emitter Action)
newResizedEmitter callback = do
  { emitter, listener } <- liftEffect H.Sub.create
  -- Create a new ResizeObserver. The observer's constructor takes as input
  -- a callback with arguments:
  -- - A ResizeObserver, which we have no use for;
  -- - A list of entries. There should be just one in our case, but we iterate
  --   with `for_` just in case.
  observer <- liftEffect $ Resize.resizeObserver $ \entries _ ->
                           for_ entries $ \entry -> callback listener entry
  -- Attach the observer to our main element. We specify that the size we're
  -- interested in is the content box of the main element.
  controlSurface <- fromJust <$> H.getHTMLElementRef (H.RefLabel "controlSurface")
  liftEffect $ Resize.observe (toElement controlSurface) { box: Resize.ContentBox } observer
  -- Return the observer so we can subscribe to its updates.
  pure emitter




-- This callback will get called every time the component gets resized.
-- It triggers this component's Resize action with the new width and height.
resizedCallback :: H.Sub.Listener Action
                -> Resize.ResizeObserverEntry
                -> Effect Unit
resizedCallback listener entry = H.Sub.notify listener $
                                   Resize entry.contentRect.width
                                          entry.contentRect.height




getCanvas :: forall m. Partial
          => H.RefLabel -> ControlSurfaceM m (Maybe HTMLCanvasElement)
getCanvas label = fromHTMLElement <$> fromJust <$> H.getHTMLElementRef label



paintOnCanvas :: forall m. MonadEffect m => Partial
              => (HTMLCanvasElement -> ControlSurfaceM m Unit)
              -> H.RefLabel -> ControlSurfaceM m Unit
paintOnCanvas paintAction label = paintAction =<< (fromJust <$> getCanvas label)





-- Given a canvas element, paint on it a piano-like(ish) background
paintPointer :: forall m. MonadEffect m
             => HTMLCanvasElement -> ControlSurfaceM m Unit
paintPointer canvas = do
  state <- H.get
  let context = Canvas.context2D canvas
  let width  = state.width
  let height = state.height
  let wholeCanvas = { x: 0.0
                    , y: 0.0
                    , width:  width
                    , height: height
                    }
  liftEffect $ Canvas.clearRect context wholeCanvas
  let contact = state.pointerState.contact
  when contact $ do
    let x = state.pointerState.x
    let y = state.pointerState.y
    let pressure = state.pointerState.pressure
    liftEffect $ do
      Canvas.clearRect context wholeCanvas
      -- Draw a couple of concentric circles whose opacity is dependent on pressure.
      -- The formulae for radius and opacity have been determined through
      -- trial and error, which is why they look arbitrary:
      -- (TODO improve/rationalize those? I think they are not beautiful but
      -- they feel good when I play the tablet)
      for_ (0..5) $ \i -> do
        let bound b value = max 0.0 $ min b $ value -- bound value between 0 and b
        let iNum = toNumber i
        let radius  = 3.0 * ((iNum + 1.0) `pow` 2.0)
        let opacity = bound (1.0 / (iNum + 1.0)) $ bound 1.0 (6.0 * pressure - iNum) `pow` 2.0
        Canvas.beginPath    context
        Canvas.setFillStyle context $ Color.rgba' 0.0 0.0 1.0 opacity
        Canvas.arc          context x y radius 0.0 (2.0 * pi) true
        Canvas.fill         context




paintLimits :: forall m. MonadEffect m
            => HTMLCanvasElement -> ControlSurfaceM m Unit
paintLimits canvas = do
  -- Get state variables
  state <- H.get
  let context = Canvas.context2D canvas
  let width  = state.width
  let height = state.height
  -- Clear canvas
  let wholeCanvas = { x: 0.0
                    , y: 0.0
                    , width:  width
                    , height: height
                    }
  liftEffect $ Canvas.clearRect context wholeCanvas

  case state.musicState of
    Nothing -> pure unit
    Just ms -> do
      let leftPitch  = state.settings.pitchRange.low
      let rightPitch = state.settings.pitchRange.high
      let basePitch = toNumber ms.basePitch
      let lowLimitPitch  = basePitch - state.settings.halfPitchBendRange
      let highLimitPitch = basePitch + state.settings.halfPitchBendRange
      let lowLimit  = width * (lowLimitPitch  - leftPitch) / (rightPitch - leftPitch)
      let highLimit = width * (highLimitPitch - leftPitch) / (rightPitch - leftPitch)
      let leftArea = { x: 0.0
                     , y: 0.0
                     , width:  lowLimit
                     , height: height
                     }
      let rightArea = { x: highLimit
                      , y: 0.0
                      , width:  width
                      , height: height
                      }
      liftEffect $ Canvas.setFillStyle context $ Color.rgba' 0.8 0.0 0.0 0.5
      liftEffect $ Canvas.fillRect context leftArea
      liftEffect $ Canvas.fillRect context rightArea





-- Given a canvas element, paint on it a piano-like(ish) background
paintBackground :: forall m. MonadEffect m
                => HTMLCanvasElement -> ControlSurfaceM m Unit
paintBackground canvas = do
  state <- H.get
  let lowPitch  = state.settings.pitchRange.low
  let highPitch = state.settings.pitchRange.high
  let blackKeyRatio = state.settings.blackKeyRatio
  let width  = state.width
  let height = state.height
  let wholeCanvas = { x: 0.0
                    , y: 0.0
                    , width:  width
                    , height: height
                    }
  let context = Canvas.context2D canvas
  liftEffect $ do
    Canvas.clearRect    context wholeCanvas
    Canvas.setFillStyle context Color.white
    Canvas.fillRect     context wholeCanvas
    for_ (floor lowPitch .. ceil highPitch) \note -> do
      let semitoneWidth = width / (highPitch - lowPitch)
      let position = semitoneWidth * (toNumber note - lowPitch)
      -- Paint a grey band around "black" semitones
      when ((note `mod` 12) `elem` [1, 3, 6, 8, 10]) $ do
        Canvas.setFillStyle context $ Color.graytone 0.5
        let blackWidth = blackKeyRatio * semitoneWidth
        let keyArea = { x: position - blackWidth / 2.0
                      , y: 0.0
                      , width:  blackWidth
                      , height: height
                      }
        Canvas.fillRect context keyArea
      -- Paint a line for each semitone
      Canvas.beginPath context
      Canvas.moveTo context position 0.0
      Canvas.lineTo context position height
      Canvas.stroke context




-- Those properties are useful for stacking several layer elements inside a
-- common parent, in such a way that each layer takes up the whole space of the
-- parent. The argument zIndex determines which layers are to be put in front of
-- which other layers: the greater the zIndex, the more in front of the stack it
-- will be.
-- Make sure that the parent does NOT have position: static! position: relative
-- can be used instead.
layerProperties :: Int -> CSS.StyleM Unit
layerProperties zIndex= do
  CSS.position CSS.absolute
  CSS.height $ CSS.pct 100.0
  CSS.width  $ CSS.pct 100.0
  CSS.zIndex zIndex
