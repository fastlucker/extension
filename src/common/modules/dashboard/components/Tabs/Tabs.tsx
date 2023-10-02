import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'

import styles from './styles'

interface Props {
  openTab: 'tokens' | 'collectibles'
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles'>>
  handleChangeQuery: (openTab: string) => void
}

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          handleChangeQuery('tokens')
          setOpenTab('tokens')
        }}
      >
        {/* todo: add the border radius here */}
        <View
          style={{
            borderBottomColor: openTab === 'tokens' ? theme.primary : 'transparent',
            ...styles.toggleItem
          }}
        >
          <Text
            shouldScale={false}
            weight="regular"
            appearance={openTab === 'tokens' ? 'primary' : 'secondaryText'}
            fontSize={16}
            style={styles.tabItemText}
          >
            {t('Tokens')}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          handleChangeQuery('collectibles')
          setOpenTab('collectibles')
        }}
      >
        <View
          style={{
            borderBottomColor: openTab === 'collectibles' ? theme.primary : 'transparent',
            ...styles.toggleItem
          }}
        >
          <Text
            shouldScale={false}
            weight="regular"
            appearance={openTab === 'collectibles' ? 'primary' : 'secondaryText'}
            fontSize={16}
            style={styles.tabItemText}
          >
            {t('Collectibles')}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export default Tabs
