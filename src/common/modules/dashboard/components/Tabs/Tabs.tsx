import React from 'react'
import { View } from 'react-native'

import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'

import getStyles from './styles'
import Tab from './Tab'
import { TabType } from './Tab/Tab'

interface Props {
  openTab: TabType
  setOpenTab: React.Dispatch<React.SetStateAction<TabType>>
  handleChangeQuery: (openTab: string) => void
}

const TABS: {
  type: TabType
  tabLabel: string
  disabled?: boolean
}[] = [
  {
    type: 'tokens',
    tabLabel: 'Tokens'
  },
  {
    type: 'collectibles',
    tabLabel: 'NFT'
  },
  {
    type: 'defi',
    tabLabel: 'DeFi',
    disabled: true
  },
  {
    type: 'activity',
    tabLabel: 'Activity',
    disabled: true
  }
]

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { styles, theme } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      {TABS.map(({ type, tabLabel, disabled }, tabIndex) => {
        const openTabIndex = TABS.findIndex((t) => t.type === openTab)
        const indexDiff = tabIndex - openTabIndex

        return (
          <View key={type} style={[flexbox.directionRow, flexbox.alignCenter]}>
            <Tab
              openTab={openTab}
              tab={type}
              tabLabel={tabLabel}
              setOpenTab={setOpenTab}
              handleChangeQuery={handleChangeQuery}
              disabled={disabled}
            />
            {tabIndex !== TABS.length - 1 && (
              <View
                style={{
                  borderRightWidth: 1,
                  height: 24,
                  borderRightColor:
                    indexDiff >= 1 || indexDiff < -1 ? theme.secondaryBorder : 'transparent'
                }}
              />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default React.memo(Tabs)
