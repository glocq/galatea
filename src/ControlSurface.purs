module ControlSurface where

-- General-purposes modules
import Prelude
import Data.Maybe        (Maybe(..))
import Data.Tuple.Nested ((/\))
import Data.Array        ((..))
import Data.Foldable     (for_, elem)
import Data.Int          (floor, ceil, toNumber)
import Effect            (Effect)
import Effect.Exception  (throw)
-- Web utilities
import Util                          (onResize_, onResizeE_, offsetX, offsetY)
import Web.DOM.Element               (Element)
import Web.PointerEvent.PointerEvent as Ptr
import Web.HTML.HTMLCanvasElement    (fromElement)
import Canvas                        as Canvas
import Color                         as Color
import CSS                           as CSS
-- Deku-related modules
import Deku.Do             as Deku
import Deku.Core           as D
import Deku.CSS            as DC
import Deku.Hooks          as DH
import Deku.DOM            as DD
import Deku.DOM.Attributes as DA
import Deku.DOM.Listeners  as DL
import Deku.DOM.Self       as Self
import FRP.Poll            as Poll
-- Local modules
import Types as Types




-- | Galatea's central component: a surface where the user is to use
-- | their pointer device (tablet or mouse).
component :: D.NutWith Types.Wires
component wires = Deku.do

  -- Define the internal state, aka the dimensions:
  setWidth  /\ width  <- DH.useHot 0.0
  setHeight /\ height <- DH.useHot 0.0

  -- The actual component: a div with three stacked canvases inside
  DD.div
    [ DA.id_ "controlSurface"
    , DA.style_ $ DC.render $ do
        CSS.position CSS.relative -- This should NOT be static, lest the children not be stacked
        CSS.border CSS.solid (CSS.px 1.0) (CSS.black)
        CSS.height $ CSS.px 300.0
        CSS.width $ CSS.pct 100.0
    , onResize_ $ \w h -> do
        setWidth  w
        setHeight h
    ]

    -- The canvases
    ([ foregroundCanvas width height
     , middleCanvas                 
     , backgroundCanvas width height
     ] <@> wires)




-- | The foreground canvas is the one that receives the pointer events.
-- | It also displays a visual indicator of the position and pressure
-- | of the pointer device.
foregroundCanvas :: Poll.Poll Number -> Poll.Poll Number
                 -> Types.Wires
                 -> D.Nut
foregroundCanvas width height wires =
  DD.canvas
    [ DA.id_ "foregroundCanvas"
    , DA.style_ $ DC.render $ layerProperties 2
    , DL.pointerdown   $ onPointerStart wires <$> width <*> height
    , DL.pointerup     $ onPointerStop  wires <$> width <*> height
    , DL.pointercancel $ onPointerStop  wires <$> width <*> height
    , DL.pointermove   $ onPointerMove  wires <$> width <*> height
    , onResizeE_ resizeCanvas
    ]
    [ DD.text_ "Your browser does not support the canvas element." ]


-- | The middle canvas lets the user know which zone they should avoid
-- | when in instrument mode, due to pitch bend limitations.
middleCanvas :: Types.Wires -> D.Nut
middleCanvas _ =
  DD.canvas
    [ DA.id_ "middleCanvas"
    , DA.style_ $ DC.render $ layerProperties 1
    , onResizeE_ resizeCanvas
    ] []


-- | The background canvas displays a visual help resembling a piano keyboard.
-- | It differs from a piano keyboard in that the lines do not correspond to
-- | separation between adjacent notes, but to the central position
-- | of each note.
backgroundCanvas :: Poll.Poll Number -> Poll.Poll Number
                 -> Types.Wires
                 -> D.Nut
backgroundCanvas width height wires =
  DD.canvas
    [ DA.id_ "backgroundCanvas"
    , DA.style_ $ DC.render $ layerProperties 0
    , Self.self $ drawBackground <$> wires.settings <*> width <*> height
    , onResizeE_ $ \elt w h -> do
        resizeCanvas elt w h
        wires.refreshBackground.push unit -- pinging ourselves to repaint background
    ] []




-- | Those properties are useful for stacking several layer elements inside a
-- | common parent, in such a way that each layer takes up the whole space of the
-- | parent. The argument zIndex determines which layers are to be put in front of
-- | which other layers: the greater the zIndex, the more in front of the stack it
-- | will be.
-- | Make sure that the parent does NOT have position: static! position: relative
-- | can be used instead.
layerProperties :: Int -> CSS.CSS
layerProperties zIndex = do
  CSS.position CSS.absolute
  CSS.height $ CSS.pct 100.0
  CSS.width  $ CSS.pct 100.0
  CSS.zIndex zIndex




-- | Resize a canvas' resolution. To be called with the new dimensions whenever
-- | the canvas is resized.
resizeCanvas :: Element -> Number -> Number -> Effect Unit
resizeCanvas element w h = do
  case fromElement element of
    Nothing -> throw "Error: Element is not a canvas."
    Just canvas -> do
      Canvas.setWidth  canvas w
      Canvas.setHeight canvas h



-- TODO cleanup and deal with edge cases better
drawBackground :: Types.Settings -> Number -> Number -> Element -> Effect Unit
drawBackground settings width height element = do
  case settings.leftPitch == settings.rightPitch of
    true  -> pure unit
    false -> case fromElement element of
      Nothing     -> throw "Error: Element is not a canvas."
      Just canvas -> do
        let wholeArea = { x: 0.0
                        , y: 0.0
                        , width:  width
                        , height: height
                        }
        let context = Canvas.context2D canvas
        Canvas.clearRect    context wholeArea
        Canvas.setFillStyle context Color.white
        Canvas.fillRect     context wholeArea
        for_ (floor settings.leftPitch .. ceil settings.rightPitch) \note -> do
          let semitoneWidth = width / (settings.rightPitch - settings.leftPitch)
          let position = semitoneWidth * (toNumber note - settings.leftPitch)
          -- Paint a grey band around "black" semitones
          when ((note `mod` 12) `elem` [1, 3, 6, 8, 10]) $ do
            Canvas.setFillStyle context $ Color.graytone 0.5
            let blackWidth = settings.blackKeyRatio * semitoneWidth
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





onPointerStart :: Types.Wires
               -> Number -> Number
               -> Ptr.PointerEvent
               -> Effect Unit
onPointerStart wires width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  wires.surfaceOut.push $ Types.Start { x: offsetX mouseEvt / width
                                      , y: offsetY mouseEvt / height
                                      , pressure: Ptr.pressure ptrEvt
                                      }

onPointerStop :: Types.Wires
              -> Number -> Number
              -> Ptr.PointerEvent
              -> Effect Unit
onPointerStop wires width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  wires.surfaceOut.push $ Types.Stop { x: offsetX mouseEvt / width
                                     , y: offsetY mouseEvt / height
                                     }

onPointerMove :: Types.Wires
              -> Number -> Number
              -> Ptr.PointerEvent
              -> Effect Unit
onPointerMove wires width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  wires.surfaceOut.push $ Types.Move { x: offsetX mouseEvt / width
                                     , y: offsetY mouseEvt / height
                                     , pressure: Ptr.pressure ptrEvt
                                     }
