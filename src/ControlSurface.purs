module ControlSurface (component, Slot) where


-- General-purpose modules
import Prelude
import Data.Maybe       (Maybe (..))
import Data.List        ((..))
import Data.Int         (floor, ceil, toNumber)
import Data.Traversable (for_)
import Effect           (Effect)
import Effect.Class     (class MonadEffect, liftEffect)
import Effect.Console   (log)
-- Halogen and web-related modules
import Halogen                          as H
import Halogen.HTML                     as HTML
import Halogen.HTML.Properties          as H.Prop
import Halogen.HTML.CSS     (style)     as H.CSS
import CSS                              as CSS
import Halogen.Subscription             as H.Sub
import Web.ResizeObserver               as Resize
import Web.HTML.HTMLElement (toElement) as HTML.Elt
import Web.HTML.HTMLCanvasElement       as HTML.Canvas
import Color                            as Color
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
-- Work in progress ! Only the background canvas for now; display does not work
-- yet, and pointer events are not dealt with yet.


{- The component -}

component :: forall query output m. MonadEffect m
          => H.Component query Types.PitchRange output m
component = H.mkComponent
  { initialState: \input -> { height: 0.0 -- will be updated at initialization
                            , width:  0.0 -- based on actual dimensions
                            , pitchRange: input
                            }
  , render: render
  , eval: H.mkEval $ H.defaultEval 
            { initialize   = Just Initialize
            , handleAction = handleAction
            }
  }


{- Types -}

type State = { height     :: Number
             , width      :: Number
             , pitchRange :: Types.PitchRange
             }

data Action = Initialize
            | Resize Number Number
            | PaintBackground

type Slot id = forall query output. H.Slot query output id -- just a helper type for parents



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
    [ H.Prop.ref $ H.RefLabel "controlSurface"
    , H.CSS.style $ do
        CSS.height $ CSS.pct 100.0
        CSS.width  $ CSS.pct 100.0
        CSS.border CSS.solid (CSS.px 1.0) CSS.black
        CSS.position CSS.relative
    ]
    [ HTML.canvas
        [ H.Prop.ref $ H.RefLabel backgroundCanvasID
        , H.CSS.style $ layerProperties 0
        ]
    , HTML.canvas
        [ H.Prop.ref $ H.RefLabel pitchRangeCanvasID
        , H.CSS.style $ layerProperties 1
        ]
    , HTML.canvas
        [ H.Prop.ref $ H.RefLabel pointerCanvasID
        , H.CSS.style $ layerProperties 2
        ]
    ]


backgroundCanvasID :: String
backgroundCanvasID = "backgroundCanvas"

pitchRangeCanvasID :: String
pitchRangeCanvasID = "pitchRangeCanvas"

pointerCanvasID :: String
pointerCanvasID = "pointerCanvas"



initialize :: forall output m. MonadEffect m
           => H.HalogenM State Action () output m Unit
initialize = do
  resizedEmitter <- newResizedEmitter resizedCallback
  _ <- H.subscribe resizedEmitter
  pure unit




handleAction :: forall output m. MonadEffect m
             => Action -> H.HalogenM State Action () output m Unit
handleAction = case _ of
  Initialize -> initialize
  Resize w h -> do
    H.modify_ $ \state -> state { height = h, width = w }
    maybeBackground <- getCanvas $ H.RefLabel backgroundCanvasID
    for_ maybeBackground $ \background -> liftEffect $ do
      Canvas.setWidth  background w
      Canvas.setHeight background h
    handleAction PaintBackground 
  PaintBackground -> paintBackground






-- Creates a new resize observer that will emit a Resize action
-- upon resizes of this component's main div. See the javascript Resize API.
newResizedEmitter :: forall output m. MonadEffect m
                  => (H.Sub.Listener Action -> Resize.ResizeObserverEntry -> Effect Unit)
                  -> H.HalogenM State Action () output m (H.Sub.Emitter Action)
newResizedEmitter callback = do
  { emitter, listener } <- liftEffect H.Sub.create
  -- Create a new ResizeObserver. The observer's constructor takes as input
  -- a callback with arguments:
  -- - A ResizeObserver, which we have no use for;
  -- - A list of entries. There should be just one in our case, but we iterate
  --   with `for_` just in case.
  observer <- liftEffect $ Resize.resizeObserver $ \entries _ ->
                           for_ entries $ \entry -> callback listener entry
  -- Attach the observer to our main element. This is a bit tedious because
  -- we have to pattern match several times to convert from our label
  -- "controlSurface" into an `Element`
  maybeControlSurface <- H.getHTMLElementRef (H.RefLabel "controlSurface")
  case maybeControlSurface of
    Nothing -> liftEffect $ log "Error: Failed to initialize resize observer. This should not have happened."
    Just controlSurface -> do
      -- We've done all the pattern matching. Now we can actually attach our
      -- observer to the element. We specify that the size we're interested in
      -- is the content box of the main element.
      liftEffect $ Resize.observe (HTML.Elt.toElement controlSurface) { box: Resize.ContentBox } observer
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




getCanvas :: forall output m.
             H.RefLabel -> H.HalogenM State Action () output m (Maybe HTML.Canvas.HTMLCanvasElement)
getCanvas label = do
  maybeElement <- H.getHTMLElementRef label
  case maybeElement of
    Nothing      -> pure Nothing
    Just element -> pure $ HTML.Canvas.fromHTMLElement element




-- Paint on it a piano-like(ish) background on the background canvas
paintBackground :: forall output m. MonadEffect m
                => H.HalogenM State Action () output m Unit
paintBackground = do
  maybeBackground <- getCanvas $ H.RefLabel backgroundCanvasID
  case maybeBackground of
    Nothing -> liftEffect $ log "Error: Failed to get background canvas. This should not have happened."
    Just background -> paintBackgroundOnCanvas background




-- Given a canvas element, paint on it a piano-like(ish) background
paintBackgroundOnCanvas :: forall output m. MonadEffect m
                        => HTML.Canvas.HTMLCanvasElement
                        -> H.HalogenM State Action () output m Unit
paintBackgroundOnCanvas canvas = do
  state <- H.get
  let lowPitch  = state.pitchRange.low
  let highPitch = state.pitchRange.high
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
      let position = width * (toNumber note - lowPitch) / (highPitch - lowPitch)
      -- Paint a line for each semitone
      Canvas.beginPath context
      Canvas.moveTo context position 0.0
      Canvas.lineTo context position height
      Canvas.stroke context
      -- TODO paint a grey band around "black" semitones



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
