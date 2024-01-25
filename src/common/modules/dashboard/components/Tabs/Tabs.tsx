import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'

import getStyles from './styles'

interface Props {
  openTab: 'tokens' | 'collectibles'
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles'>>
  handleChangeQuery: (openTab: string) => void
}

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          handleChangeQuery('tokens')
          setOpenTab('tokens')
        }}
      >
        {/* todo: add the border radius here */}
        <View style={[styles.toggleItem, openTab === 'tokens' ? styles.toggleItemActive : {}]}>
          <Text
            weight="regular"
            appearance={openTab === 'tokens' ? 'primary' : 'secondaryText'}
            fontSize={16}
          >
            {t('Tokens')}
          </Text>
        </View>
      </Pressable>
      <Pressable
        testID='collectibles-tab'
        onPress={() => {
          handleChangeQuery('collectibles')
          setOpenTab('collectibles')
        }}
      >
        <View
          style={[styles.toggleItem, openTab === 'collectibles' ? styles.toggleItemActive : {}]}
        >
          <Text
            weight="regular"
            appearance={openTab === 'collectibles' ? 'primary' : 'secondaryText'}
            fontSize={16}
          >
            {t('Collectibles')}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

export default Tabs
