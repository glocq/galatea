module Main where

-- General-purpose modules
import Prelude
import Effect (Effect)
-- Halogen modules
import Halogen.Aff         as HA
import Halogen.VDom.Driver as HD
-- Local module
import Galatea as Galatea


main :: Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  HD.runUI Galatea.component unit body
