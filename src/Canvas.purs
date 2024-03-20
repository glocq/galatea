module Canvas ( Context2D
              , Rectangle
              , context2D
              , clearRect
              , setFillStyle
              , fillRect
              , beginPath
              , moveTo
              , lineTo
              , stroke
              , arc
              , fill
              , setWidth
              , setHeight
              ) where

import Prelude

import Color  (Color, toHexString)
import Effect (Effect)
import Web.HTML.HTMLCanvasElement as Canvas


foreign import data Context2D :: Type

type Rectangle = { x      :: Number -- x and y are coordinates of 
                 , y      :: Number -- the top left corner
                 , height :: Number
                 , width  :: Number
                 }

foreign import context2D :: Canvas.HTMLCanvasElement -> Context2D
foreign import beginPath :: Context2D -> Effect Unit
foreign import moveTo    :: Context2D -> Number -> Number -> Effect Unit
foreign import lineTo    :: Context2D -> Number -> Number -> Effect Unit
foreign import stroke    :: Context2D -> Effect Unit
foreign import arc       :: Context2D -> Number -> Number -> Number -> Number -> Number -> Boolean -> Effect Unit
foreign import fill      :: Context2D -> Effect Unit
foreign import setWidth  :: Canvas.HTMLCanvasElement -> Number -> Effect Unit
foreign import setHeight :: Canvas.HTMLCanvasElement -> Number -> Effect Unit


clearRect :: Context2D -> Rectangle -> Effect Unit
clearRect context rectangle = clearRectImpl context rectangle.x
                                                    rectangle.y
                                                    rectangle.width
                                                    rectangle.height

setFillStyle :: Context2D -> Color -> Effect Unit
setFillStyle context color = setFillStyleImpl context $ toHexString color

fillRect :: Context2D -> Rectangle -> Effect Unit
fillRect context rectangle = fillRectImpl context rectangle.x
                                                  rectangle.y
                                                  rectangle.width
                                                  rectangle.height



-- Raw implementations

foreign import clearRectImpl    :: Context2D -> Number -> Number -> Number -> Number -> Effect Unit
foreign import setFillStyleImpl :: Context2D -> String -> Effect Unit
foreign import fillRectImpl     :: Context2D -> Number -> Number -> Number -> Number -> Effect Unit
