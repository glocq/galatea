module ControlSurface where

-- General-purposes modules
import Prelude
import Data.Maybe              (Maybe(..))
import Data.Tuple.Nested       (type (/\), (/\))
import Data.Array              ((..))
import Data.Foldable           (for_, elem)
import Data.Int                (floor, ceil, toNumber)
import Data.Number             (pow, pi)
import Effect                  (Effect)
import Effect.Aff              (runAff_)
import Effect.Exception        (throw)
-- Web utilities
import Web.DOM.Element               (Element)
import Web.Event.Event               as Web.Event
import Web.PointerEvent.PointerEvent as Ptr
import Web.HTML.HTMLCanvasElement    as CanvasElt
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
import FRP.Event           as Event
-- Local modules
import Util  ( ($?)
             , nullDelay
             , requestFullscreen
             , onResize_, onResizeE_
             , offsetX, offsetY)
import Types as Types




-- | Galatea's central component: a surface where the user is to use
-- | their pointer device (tablet or mouse).
component :: Types.Wires -> D.Nut
component wires = Deku.do

  -- Define the internal state:
  setWidth  /\ width  <- DH.useState 0.0
  setHeight /\ height <- DH.useState 0.0
  setPointerState /\ pointerState <- DH.useState Nothing

  -- The actual component: a div with three stacked canvases inside
  DD.div
    [ DA.id_ "controlSurface"
    , Self.self_ $ subscribeToFullscreen wires.setFullscreen.event
    , DA.style_ $ DC.render $ do
        CSS.position CSS.relative -- This should NOT be static, lest the children not be stacked
        CSS.border CSS.solid (CSS.px 1.0) (CSS.black)
        CSS.height $ CSS.px 350.0
        CSS.width $ CSS.pct 100.0
    , onResize_ $ \w h -> do
        setWidth  w
        setHeight h
    ]

    -- The canvases
    ([ foregroundCanvas width height pointerState setPointerState
     , middleCanvas     width height        
     , backgroundCanvas width height
     ] <@> wires)




-------------------------
-- Fullscreen handling --
-------------------------

subscribeToFullscreen :: Event.Event Unit -> Element -> Effect Unit
subscribeToFullscreen event element =
  -- Discard the unsubscriber, since we won't ever need it:
  void $
  -- Subscribe to requests to switch to fullscreen:
  Event.subscribe event $ const $
  -- Actually do the switching:
  runAff_ (const mempty) $ requestFullscreen element


-----------------------
-- Foreground Canvas --
-----------------------


-- | The foreground canvas is the one that receives the pointer events.
-- | It also displays a visual indicator of the position and pressure
-- | of the pointer device.
foregroundCanvas :: Poll.Poll Number -> Poll.Poll Number
                 -> Poll.Poll Types.PointerState
                 -> (Types.PointerState -> Effect Unit)
                 -> Types.Wires
                 -> D.Nut
foregroundCanvas width height pointerState setPointerState wires =
  DD.canvas
    [ DA.id_ "foregroundCanvas"
    , DA.style_ $ DC.render $ layerProperties 2
    , DL.pointerdown   $ action onPointerStart <$> width <*> height <*> pointerState
    , DL.pointerup     $ action onPointerStop  <$> width <*> height <*> pointerState
    , DL.pointercancel $ action onPointerStop  <$> width <*> height <*> pointerState
    , DL.pointermove   $ action onPointerMove  <$> width <*> height <*> pointerState
    , onResizeE_ resizeCanvas
    ]
    [ DD.text_ "Your browser does not support the canvas element." ]

  where action updater w h ptr ev = do
          updater wires setPointerState w h ev
          nullDelay $ paintPointer w h ptr $? ptrEventToElement ev



paintPointer :: Number -> Number
             -> Types.PointerState
             -> CanvasElt.HTMLCanvasElement
             -> Effect Unit
paintPointer width height pointerState canvas = do
    let context = Canvas.context2D canvas
    let wholeCanvas = { x: 0.0
                      , y: 0.0
                      , width:  width
                      , height: height
                      }
    Canvas.clearRect context wholeCanvas
    case pointerState of
      Nothing -> pure unit
      Just st -> if st.pressure <= 0.0 then pure unit else do
        let x = st.x
        let y = st.y
        let pressure = st.pressure
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



onPointerStart :: Types.Wires
               -> (Types.PointerState -> Effect Unit)
               -> Number -> Number
               -> Ptr.PointerEvent
               -> Effect Unit
onPointerStart wires setPointerState width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  -- Set pointer state internally to redraw pointer
  setPointerState $ Just { x: offsetX mouseEvt
                         , y: offsetY mouseEvt
                         , pressure: Ptr.pressure ptrEvt
                         }
  -- Send pointer state to the outside
  wires.surfaceOut.push $ Types.Start { x: offsetX mouseEvt / width
                                      , y: offsetY mouseEvt / height
                                      , pressure: Ptr.pressure ptrEvt
                                      }

onPointerStop :: Types.Wires
              -> (Types.PointerState -> Effect Unit)
              -> Number -> Number
              -> Ptr.PointerEvent
              -> Effect Unit
onPointerStop wires setPointerState width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  -- Set pointer state internally to (not) redraw pointer
  setPointerState $ Nothing
  -- Send pointer state to the outside
  wires.surfaceOut.push $ Types.Stop { x: offsetX mouseEvt / width
                                     , y: offsetY mouseEvt / height
                                     }

onPointerMove :: Types.Wires
              -> (Types.PointerState -> Effect Unit)
              -> Number -> Number
              -> Ptr.PointerEvent
              -> Effect Unit
onPointerMove wires setPointerState width height ptrEvt = do
  let mouseEvt = Ptr.toMouseEvent ptrEvt
  -- Set pointer state internally to redraw pointer
  setPointerState $ Just { x: offsetX mouseEvt
                         , y: offsetY mouseEvt
                         , pressure: Ptr.pressure ptrEvt
                         }
  -- Send pointer state to the outside
  wires.surfaceOut.push $ Types.Move { x: offsetX mouseEvt / width
                                     , y: offsetY mouseEvt / height
                                     , pressure: Ptr.pressure ptrEvt
                                     }


-------------------
-- Middle Canvas --
-------------------


-- | The middle canvas lets the user know which zone they should avoid
-- | when in instrument mode, due to pitch bend limitations.
middleCanvas :: Poll.Poll Number -> Poll.Poll Number
             -> Types.Wires
             -> D.Nut
middleCanvas width height wires =
  DD.canvas
    [ DA.id_ "middleCanvas"
    , DA.style_ $ DC.render $ layerProperties 1
    , onResizeE_ resizeCanvas
    , Self.self $
        (\l w h elt -> nullDelay $ drawPitchBendLimits l w h elt)
          <$> wires.pitchBendLimits
          <*> width
          <*> height
    ] []


drawPitchBendLimits :: Maybe (Number /\ Number)
                    -> Number -> Number
                    -> Element
                    -> Effect Unit
drawPitchBendLimits limits width height element =
  case CanvasElt.fromElement element of
    Nothing -> throw "Error: Element is not a canvas."
    Just canvas -> do
      let context = Canvas.context2D canvas
      Canvas.clearRect context {x: 0.0, y: 0.0, width: width, height: height}
      case limits of
        Nothing -> pure unit
        Just (lim1 /\ lim2) -> do
          Canvas.setFillStyle context $ Color.rgba' 0.8 0.0 0.0 0.3 -- transparent red
          Canvas.fillRect context { x: 0.0
                                  , y: 0.0
                                  , width: width * lim1
                                  , height: height
                                  }
          Canvas.fillRect context { x: width * lim2
                                  , y: 0.0
                                  , width: width * (1.0 - lim2)
                                  , height: height
                                  }



-----------------------
-- Background Canvas --
-----------------------


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
    , Self.self $
        (\s w h elt -> nullDelay $ drawBackground s w h elt)
          <$> wires.settings
          <*> width
          <*> height
    , onResizeE_ $ \elt w h -> resizeCanvas elt w h
    ] []


-- TODO cleanup and deal with edge cases better
drawBackground :: Types.Settings -> Number -> Number -> Element -> Effect Unit
drawBackground settings width height element =
  case settings.leftPitch == settings.rightPitch of
    true  -> pure unit
    false -> case CanvasElt.fromElement element of
      Nothing     -> throw "Error: Element is not a canvas."
      Just canvas -> do
        let wholeArea = {x: 0.0, y: 0.0, width: width, height: height}
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




----------------------
-- Helper Functions --
----------------------

ptrEventToElement :: Ptr.PointerEvent -> Maybe CanvasElt.HTMLCanvasElement
ptrEventToElement evt = evt # Ptr.toEvent # Web.Event.target >>= CanvasElt.fromEventTarget


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
  case CanvasElt.fromElement element of
    Nothing -> throw "Error: Element is not a canvas."
    Just canvas -> do
      Canvas.setWidth  canvas w
      Canvas.setHeight canvas h
