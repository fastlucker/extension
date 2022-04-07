import React, { createContext, useMemo, useState } from 'react'
import { LayoutAnimation, Platform, UIManager } from 'react-native'

import Panel from '@modules/common/components/Panel'

type ExpandableCardData = {
  isExpanded: boolean
  expand: () => void
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

const ExpandableCardProvider: React.FC = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const expand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(450, 'linear', 'opacity'))
    setIsExpanded(true)
  }

  const collapse = () => {
    LayoutAnimation.configureNext(LayoutAnimation.create(450, 'linear', 'opacity'))
    setIsExpanded(false)
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
      <Panel type="filled" style={!isExpanded && { minHeight: 120 }}>
        {children}
      </Panel>
    </ExpandableCardContext.Provider>
  )
}

export { ExpandableCardContext, ExpandableCardProvider }
