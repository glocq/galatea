module Webpage where

import Prelude
import Effect                  (Effect)
import Deku.Core               as D
import Deku.DOM                as DD
import Deku.DOM.Attributes     as DA
import Deku.CSS                as DC
import CSS                     as CSS
import Style                   as Style
import Internationalization    as I18n
import Galatea                 as Galatea


component :: Effect D.Nut
component = do
  galatea <- Galatea.component
  pure $ DD.h1  [ DA.style_ Style.titleStyle ]
                [ DD.text_ "Galatea" ]          <>
         DD.div [ DA.id_ "bottomText"
                , DA.style_ Style.subtitleStyle
                ] [ I18n.bottomText ]           <>
         DD.div [ DA.id_ "galatea"
                , DA.style_ $ DC.render $ CSS.marginBottom $ CSS.px 30.0
                ] [ galatea ]
