import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import mixHexColors from '@common/utils/mixHexColors'

import getStyles from './styles'

interface Props {
  openTab: string
  tab: 'tokens' | 'collectibles' | 'defi'
  tabLabel: string
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles' | 'defi'>>
  handleChangeQuery: (openTab: 'tokens' | 'collectibles' | 'defi') => void
  gradientColors: string[]
}

const Tab = ({ openTab, tab, tabLabel, setOpenTab, handleChangeQuery, gradientColors }: Props) => {
  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const isActive = openTab === tab

  return (
    <Pressable
      onPress={() => {
        handleChangeQuery(tab)
        setOpenTab(tab)
      }}
    >
      <LinearGradient
        colors={
          isActive
            ? [
                mixHexColors(gradientColors[0], gradientColors[2]),
                mixHexColors(mixHexColors(gradientColors[0], gradientColors[2]), gradientColors[1])
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
            width: tab === 'defi' ? 152 : 96
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
