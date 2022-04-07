import React, { createContext, useContext, useMemo, useState } from 'react'
import { LayoutAnimation, Platform, UIManager, View } from 'react-native'

import Panel from '@modules/common/components/Panel'

import { CARDS, CardsVisibilityContext } from '../cardsVisibilityContext'

type ExpandableCardData = {
  isExpanded: boolean
  expand: (cardName: CARDS) => void
  collapse: () => void
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
  }
}

const ExpandableCardContext = createContext<ExpandableCardData>({
  isExpanded: false,
  expand: () => {},
  collapse: () => {}
})

const ExpandableCardProvider: React.FC<any> = ({ children, cardName: name }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const { visibleCard, setVisibleCard } = useContext(CardsVisibilityContext)

  const expand = (cardName: CARDS) => {
    LayoutAnimation.configureNext(LayoutAnimation.create(450, 'linear', 'opacity'))
    setVisibleCard(cardName)
    setIsExpanded(true)
  }

  const collapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(450, 'linear', 'opacity'))
    setIsExpanded(false)
    setVisibleCard(null)
  }

  return (
    <ExpandableCardContext.Provider
      value={useMemo(
        () => ({
          isExpanded,
          expand,
          collapse
        }),
        [isExpanded]
      )}
    >
      {/*
        This view is here because of the display none prop.
        We don't want the card to loose its position in the cards list
      */}
      <View>
        <Panel
          type="filled"
          style={[
            !isExpanded && { minHeight: 120 },
            !!visibleCard && visibleCard !== name && { display: 'none' }
          ]}
        >
          {children}
        </Panel>
      </View>
    </ExpandableCardContext.Provider>
  )
}

export { ExpandableCardContext, ExpandableCardProvider }
