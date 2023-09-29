import React from 'react'
import { Pressable, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'

import styles from './styles'

interface Props {
  openTab: 'tokens' | 'collectibles'
  setOpenTab: React.Dispatch<React.SetStateAction<'tokens' | 'collectibles'>>
  handleChangeQuery: (openTab: string) => void
}

const Tabs: React.FC<Props> = ({ openTab, setOpenTab, handleChangeQuery }) => {
  const { t } = useTranslation()

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
            borderBottomColor: openTab === 'tokens' ? colors.violet : 'transparent',
            ...styles.toggleItem
          }}
        >
          <Text
            shouldScale={false}
            weight="regular"
            color={openTab === 'tokens' ? colors.violet : colors.martinique_65}
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
            borderBottomColor: openTab === 'collectibles' ? colors.violet : 'transparent',
            ...styles.toggleItem
          }}
        >
          <Text
            shouldScale={false}
            weight="regular"
            color={openTab === 'collectibles' ? colors.violet : colors.martinique_65}
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
