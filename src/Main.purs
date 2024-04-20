module Main where

-- General-purpose modules:
import Prelude
import Effect                 (Effect)
-- Deku-related module:
import Deku.Toplevel (runInBody)
-- Local module:
import Webpage as Webpage


main :: Effect Unit
main = runInBody =<< Webpage.component
