module Util where

-- General-purpose modules
import Prelude
import Effect           (Effect)
import Data.Traversable (traverse_)
import Data.Maybe       (Maybe(..))
import Effect.Aff       (Aff)
import Control.Promise  (Promise, toAffE)
-- Web utilities
import Web.DOM.Element           as Element
import Web.Resize.Observer       as RO
import Web.Resize.Observer.Entry as ROE
import Web.UIEvent.MouseEvent    as Mouse
-- Deku-related modules
import FRP.Poll       (Poll)
import Deku.Attribute (Attribute)
import Deku.DOM.Self  (self_)



----------------
-- Fullscreen --
----------------

foreign import requestFullscreenImpl :: Element.Element -> Effect (Promise Boolean)

requestFullscreen :: Element.Element -> Aff Boolean
requestFullscreen element = toAffE $ requestFullscreenImpl element


----------------------------------------
-- Listen for element resizes in Deku --
----------------------------------------


-- | An event that is fired whenever the input element is resized.
onResize
  :: forall r
   . RO.ResizeObserverCallback
  -> Poll (Attribute r)
onResize callback = self_ $ \element -> do
  observer <- RO.newResizeObserver callback
  observer `RO.observe` element


-- | Same as onResize, but the callback takes the original element
-- | as an additional input.
onResizeE
  :: forall r
   . (Element.Element -> RO.ResizeObserverCallback)
  -> Poll (Attribute r)
onResizeE callback = self_ $ \element -> do
  observer <- RO.newResizeObserver $ callback element
  observer `RO.observe` element


-- | A version of `onResize` to be used whenever you just need the width
-- | and height of your element
onResize_
  :: forall r
   . (Number -> Number -> Effect Unit)
  -> Poll (Attribute r)
onResize_ callback = onResize $ \entries _ ->
  let applyCallback :: (Number -> Number -> Effect Unit)
                    -> ROE.ResizeObserverEntry
                    -> Effect Unit
      applyCallback cb entry = let rect = entry.contentRect
                               in cb rect.width rect.height
  in traverse_ (applyCallback callback) entries


-- | Same as onResize_, but the callback takes the original element
-- | as an additional input.
onResizeE_
  :: forall r
   . (Element.Element -> Number -> Number -> Effect Unit)
  -> Poll (Attribute r)
onResizeE_ callback = onResizeE $ \element entries _ ->
  let applyCallback :: (Element.Element -> Number -> Number -> Effect Unit)
                    -> ROE.ResizeObserverEntry
                    -> Effect Unit
      applyCallback cb entry = let rect = entry.contentRect
                               in cb element rect.width rect.height
  in traverse_ (applyCallback callback) entries


------------------------------------------------------------------------
-- Coordinates of a mouse event relative to the corresponding element --
------------------------------------------------------------------------

-- | X coordinate of the mouse event relative to its target element
foreign import offsetX :: Mouse.MouseEvent -> Number
-- | Y coordinate of the mouse event relative to its target element
foreign import offsetY :: Mouse.MouseEvent -> Number


-----------------------
-- Helpful combinator --
-----------------------

performIfJust :: forall a. (a -> Effect Unit) -> Maybe a -> Effect Unit
performIfJust _      Nothing  = pure unit
performIfJust effect (Just x) = effect x

infixl 4 performIfJust as $?
