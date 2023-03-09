import React, { createContext, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Path, Svg } from 'react-native-svg'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'

import styles from './styles'

export interface AssetsToggleContextReturnType {
  type: 'tokens' | 'collectibles'
}

const AssetsToggleContext = createContext<AssetsToggleContextReturnType>({
  type: 'tokens'
})

const AssetsToggleProvider: React.FC = ({ children }) => {
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
      <View>
        <View style={styles.toggleContainer}>
          {/* Tokens button */}
          <View
            style={[
              styles.toggleItemWrapper,
              type === 'tokens' && {
                backgroundColor: colors.valhalla
              }
            ]}
          >
            <TouchableOpacity style={[styles.toggleItem]} onPress={() => setType('tokens')}>
              <Text
                fontSize={16}
                weight="regular"
                color={type === 'tokens' ? colors.titan : colors.chetwode}
              >
                {t('Tokens')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Inverted border radius */}
          <View
            style={[
              styles.invertedRadiusWrapper,
              {
                transform: [{ translateX: type === 'collectibles' ? -13 : 0 }]
              }
            ]}
            pointerEvents="none"
          >
            <Svg
              width={13}
              height={13}
              style={{
                transform: [{ rotate: type === 'tokens' ? '90deg' : '0deg' }]
              }}
            >
              <Path
                fill={colors.valhalla}
                stroke={colors.valhalla}
                d="M13 0 V13 H0 V13 Q13 13 13 0"
              />
            </Svg>
          </View>
          {/* Collectibles button */}
          <View
            style={[
              styles.toggleItemWrapper,
              type === 'collectibles' && {
                backgroundColor: colors.valhalla
              }
            ]}
          >
            <TouchableOpacity style={[styles.toggleItem]} onPress={() => setType('collectibles')}>
              <Text
                fontSize={16}
                weight="regular"
                color={type === 'collectibles' ? colors.titan : colors.chetwode}
              >
                {t('Collectibles')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {children}
      </View>
    </AssetsToggleContext.Provider>
  )
}

export { AssetsToggleContext, AssetsToggleProvider }
