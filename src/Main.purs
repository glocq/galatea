module Main where

-- General-purpose modules:
import Prelude
import Control.Monad.ST.Class (liftST)
import Effect                 (Effect)
-- Deku-related module:
import Deku.Toplevel (runInBody)
-- Local module:
import Webpage as Webpage


main :: Effect Unit
main = runInBody =<< liftST Webpage.component
