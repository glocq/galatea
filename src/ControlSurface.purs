module ControlSurface (component, Slot) where

-- General-purpose module
import Prelude
import Data.Maybe       (Maybe (..))
import Data.List        ((..))
import Data.Int         (floor, ceil, toNumber)
import Data.Foldable    (traverse_)
import Data.Traversable (for_)
import Effect.Class     (class MonadEffect, liftEffect)
import Effect.Console   (log)
import Data.Number.Format (toString)
-- Halogen and web-related modules
import Halogen                          as H
import Halogen.HTML                     as HTML
import Halogen.HTML.Properties          as HTML.Prop
import Halogen.HTML.CSS     (style)     as H.CSS
import CSS                              as CSS
import Halogen.Subscription             as Subscription
import Web.ResizeObserver               as Resize
import Web.HTML.HTMLElement (toElement) as Elt
import Web.HTML.HTMLCanvasElement       as CanvasElt
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
    [ HTML.Prop.ref $ H.RefLabel "controlSurface"
    , H.CSS.style $ do
        CSS.height $ CSS.pct 100.0
        CSS.width  $ CSS.pct 100.0
        CSS.border CSS.solid (CSS.px 1.0) CSS.black
        CSS.position CSS.relative
    ]
    [ HTML.canvas
        [ HTML.Prop.ref $ H.RefLabel "backgroundCanvas"
        , H.CSS.style $ layerProperties 0
        ]
    , HTML.canvas
        [ HTML.Prop.ref $ H.RefLabel "pitchRangeCanvas"
        , H.CSS.style $ layerProperties 1
        ]
    , HTML.canvas
        [ HTML.Prop.ref $ H.RefLabel "pointerCanvas"
        , H.CSS.style $ layerProperties 2
        ]
    ]


handleAction :: forall output m. MonadEffect m
             => Action -> H.HalogenM State Action () output m Unit
handleAction = case _ of
  Initialize -> initialize
  Resize w h -> do
    H.modify_ $ \state -> state { height = h, width = w }
    handleAction PaintBackground
  PaintBackground -> paintBackground


-- Paint on it a piano-like(ish) background on the background canvas
paintBackground :: forall output m. MonadEffect m
                => H.HalogenM State Action () output m Unit
paintBackground = do
  maybeBackground <- H.getHTMLElementRef (H.RefLabel "backgroundCanvas")
  case maybeBackground of
    Nothing -> liftEffect $ log "Error: Failed to get background canvas. This should not have happened."
    Just background -> case CanvasElt.fromHTMLElement background of
      Nothing -> liftEffect $ log "Error: Background is not a canvas. This should not have happened."
      Just canvas -> paintBackgroundOnCanvas canvas


-- Given a canvas element, paint on it a piano-like(ish) background
paintBackgroundOnCanvas :: forall output m. MonadEffect m
                        => CanvasElt.HTMLCanvasElement
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
    log $ toString wholeCanvas.width
    log $ toString wholeCanvas.height
    Canvas.clearRect    context wholeCanvas
    Canvas.setFillStyle context Color.white
    Canvas.fillRect     context wholeCanvas
    for_ (floor lowPitch .. ceil highPitch) \note -> do
      let position = width * (toNumber note - lowPitch) / (highPitch - lowPitch)
      -- Paint a line for each semitone (TODO doesn't work)
      Canvas.beginPath context
      Canvas.moveTo context position 0.0
      Canvas.lineTo context position height
      Canvas.stroke context
      -- TODO paint a grey band around "black" semitones


initialize :: forall output m. MonadEffect m
           => H.HalogenM State Action () output m Unit
initialize = do
  resizedEmitter <- newResizedEmitter
  _ <- H.subscribe resizedEmitter
  pure unit


-- Creates a new resize observer that will emit a Resize action
-- upon resizes of this component's main div. See the javascript Resize API.
newResizedEmitter :: forall output m. MonadEffect m
                  => H.HalogenM State Action () output m (Subscription.Emitter Action)
newResizedEmitter = do
  { emitter, listener } <- liftEffect Subscription.create
  let callback = \e -> Subscription.notify listener $ Resize e.contentRect.x
                                                             e.contentRect.y
  observer <- liftEffect $ Resize.resizeObserver $ const <<< (traverse_ callback)
  maybeControlSurface <- H.getHTMLElementRef (H.RefLabel "controlSurface")
  case maybeControlSurface of
    Nothing -> liftEffect $ log "Error: Failed to initialize resize observer. This should not have happened."
    Just controlSurface -> do
      liftEffect $ Resize.observe (Elt.toElement controlSurface) { box: Resize.ContentBox } observer
  pure emitter


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
