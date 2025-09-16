import React, { useMemo } from 'react'
import { View } from 'react-native'

import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useActivityControllerState from '@web/hooks/useActivityControllerState'

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
  testID?: string
}[] = [
  {
    testID: 'tab-tokens',
    type: 'tokens',
    tabLabel: 'Tokens'
  },
  {
    testID: 'tab-nft',
    type: 'collectibles',
    tabLabel: 'NFT'
  },
  {
    testID: 'tab-defi',
    type: 'defi',
    tabLabel: 'DeFi'
  },
  {
    testID: 'tab-activity',
    type: 'activity',
    tabLabel: 'Activity'
  }
]

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { styles, theme } = useTheme(getStyles)

  const { broadcastedButNotConfirmed } = useActivityControllerState()

  const hasPendingActivity = useMemo(() => {
    return !!broadcastedButNotConfirmed.length
  }, [broadcastedButNotConfirmed])

  return (
    <View style={[styles.container]}>
      {TABS.map(({ type, tabLabel, disabled, testID }, tabIndex) => {
        const openTabIndex = TABS.findIndex((t) => t.type === openTab)
        const indexDiff = tabIndex - openTabIndex

        const isActive = openTab === type

        return (
          <View key={type} style={[flexbox.directionRow, flexbox.alignCenter]}>
            <Tab
              testID={testID}
              openTab={openTab}
              tab={type}
              tabLabel={tabLabel}
              setOpenTab={setOpenTab}
              handleChangeQuery={handleChangeQuery}
              disabled={disabled}
              customColors={
                type === 'activity' && !isActive && hasPendingActivity
                  ? [`${theme.warningDecorative2 as any}45`, `${theme.warningDecorative2 as any}07`]
                  : undefined
              }
              style={type === 'activity' ? { width: 100 } : undefined}
            >
              {type === 'activity' && !isActive && hasPendingActivity && (
                <View style={[spacings.mlTy, flexbox.alignCenter, flexbox.justifyCenter]}>
                  <Spinner style={{ width: 18, height: 18 }} variant="warning" />
                  <Text
                    fontSize={10}
                    weight="medium"
                    style={{ position: 'absolute' }}
                    appearance="warningText"
                  >
                    {broadcastedButNotConfirmed.length}
                  </Text>
                </View>
              )}
            </Tab>
            {tabIndex !== TABS.length - 1 && (
              <View
                style={{
                  borderRightWidth: 1,
                  height: 24,
                  borderRightColor:
                    TABS[tabIndex + 1]?.type === 'activity' && hasPendingActivity
                      ? 'transparent'
                      : indexDiff >= 1 || indexDiff < -1
                      ? theme.secondaryBorder
                      : 'transparent'
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
