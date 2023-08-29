import React, { createContext, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'

import Search from '@common/components/Search'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import styles from './styles'

export interface AssetsToggleContextReturnType {
  type: 'tokens' | 'collectibles'
}

const AssetsToggleContext = createContext<AssetsToggleContextReturnType>({
  type: 'tokens'
})

const AssetsToggleProvider: React.FC = ({ children }: any) => {
  const [type, setType] = useState<'tokens' | 'collectibles'>('tokens')

  const { t } = useTranslation()

  return (
    <AssetsToggleContext.Provider
      value={useMemo(
        () => ({
          type
        }),
        [type]
      )}
    >
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.ph]}>
        <View style={[flexbox.directionRow]}>
          <Pressable onPress={() => setType('tokens')}>
            {/* todo: add the border radius here */}
            <View
              style={{
                borderBottomColor: type === 'tokens' ? colors.violet : 'transparent',
                ...styles.toggleItem
              }}
            >
              <Text
                shouldScale={false}
                weight="regular"
                color={type === 'tokens' ? colors.violet : colors.martinique_65}
                fontSize={16}
                style={[spacings.mbTy]}
              >
                {t('Tokens')}
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setType('collectibles')}>
            <View
              style={{
                borderBottomColor: type === 'collectibles' ? colors.violet : 'transparent',
                ...styles.toggleItem
              }}
            >
              <Text
                shouldScale={false}
                weight="regular"
                color={type === 'collectibles' ? colors.violet : colors.martinique_65}
                fontSize={16}
                style={[spacings.mbTy]}
              >
                {t('Collectibles')}
              </Text>
            </View>
          </Pressable>
        </View>

        <Search />
      </View>
      {children}
    </AssetsToggleContext.Provider>
  )
}

export { AssetsToggleContext, AssetsToggleProvider }
