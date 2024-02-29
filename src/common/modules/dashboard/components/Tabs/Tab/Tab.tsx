import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import { DASHBOARD_OVERVIEW_BACKGROUND } from '@common/modules/dashboard/screens/styles'
import { getAvatarColors } from '@common/utils/avatars'
import mixHexColors from '@common/utils/mixHexColors'
import useMainControllerState from '@web/hooks/useMainControllerState'

import getStyles from './styles'

interface Props {
  openTab: string
  tab: 'tokens' | 'collectibles' | 'defi'
  tabLabel: string
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles' | 'defi'>>
  handleChangeQuery: (openTab: 'tokens' | 'collectibles' | 'defi') => void
  disabled?: boolean
}

const Tab = ({ openTab, tab, tabLabel, setOpenTab, handleChangeQuery, disabled }: Props) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const { selectedAccount } = useMainControllerState()
  const avatarColors = getAvatarColors(selectedAccount || '')

  const isActive = openTab === tab

  return (
    <Pressable
    testID={'tab-' + tabLabel.toLowerCase().replace(/\s+/g, '-')}
    onPress={() => {
        if (disabled) return
        handleChangeQuery(tab)
        setOpenTab(tab)
      }}
    >
      <LinearGradient
        colors={
          isActive
            ? [
                DASHBOARD_OVERVIEW_BACKGROUND,
                mixHexColors(DASHBOARD_OVERVIEW_BACKGROUND, avatarColors[1], 0.8)
              ]
            : ['transparent', 'transparent']
        }
        start={{
          x: 0.0,
          y: 0
        }}
        end={{
          x: 1.0,
          y: 0.0
        }}
        locations={[0.7, 1]}
        style={[
          styles.toggleItem,
          {
            width: tab === 'defi' ? 152 : 96,
            opacity: disabled ? 0.4 : 1,
            // @ts-ignore cursor is web only
            cursor: disabled ? 'not-allowed' : 'pointer'
          }
        ]}
      >
        <Text
          weight={isActive ? 'medium' : 'regular'}
          color={isActive ? theme.primaryBackground : theme.secondaryText}
          fontSize={16}
        >
          {t(tabLabel)}
        </Text>
      </LinearGradient>
    </Pressable>
  )
}

export default Tab
