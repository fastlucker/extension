import React, { Dispatch, SetStateAction } from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

export type TabId = 'transactions' | 'messages' | 'cross-chain'

type Tab = {
  id: TabId
  label: string
}

const TABS: Tab[] = [
  {
    id: 'transactions',
    label: 'Confirmed Transactions'
  },
  {
    id: 'messages',
    label: 'Signed Messages'
  },
  {
    id: 'cross-chain',
    label: 'Cross-Chain Bridge'
  }
]

const Tabs = ({
  selectedTab,
  setTab
}: {
  selectedTab: TabId
  setTab: Dispatch<SetStateAction<TabId>>
}) => {
  const { theme, styles } = useTheme(getStyles)
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isSelected = selectedTab === tab.id
        return (
          <Pressable
            onPress={() => setTab(tab.id)}
            key={tab.id}
            style={[styles.tab, isSelected ? styles.selectedTab : {}]}
          >
            <Text
              style={[
                spacings.phSm,
                {
                  borderLeftWidth: 1,
                  width: '100%',
                  textAlign: 'center',
                  borderRightWidth: 1,
                  borderRightColor:
                    TABS.findIndex((t) => t.id === selectedTab) === 0 && tab.id === TABS[1].id
                      ? theme.secondaryBorder
                      : 'transparent',
                  borderLeftColor:
                    TABS.findIndex((t) => t.id === selectedTab) === 2 && tab.id === TABS[1].id
                      ? theme.secondaryBorder
                      : 'transparent'
                }
              ]}
              fontSize={16}
              appearance={isSelected ? 'primary' : 'secondaryText'}
            >
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default Tabs
