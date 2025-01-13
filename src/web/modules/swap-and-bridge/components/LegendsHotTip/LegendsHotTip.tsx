/* eslint-disable react/jsx-no-useless-fragment */
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Image, View } from 'react-native'

import { isSmartAccount } from '@ambire-common/libs/account/account'
import LegendsLogo from '@common/assets/images/legends-logo-small.png'
import FireIcon from '@common/assets/svg/FireIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { LEGENDS_SUPPORTED_NETWORKS_BY_CHAIN_ID } from '@legends/constants/networks'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import getStyles from './styles'

type Props = {
  chainId: number | null
}

const LegendsHotTip = ({ chainId }: Props) => {
  const { account } = useSelectedAccountControllerState()
  const { styles } = useTheme(getStyles)
  const { t } = useTranslation()

  const [isHovered, setIsHovered] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const animation = useRef(new Animated.Value(0)).current

  const toggleExpand = (hover: boolean) => {
    const toValue = hover ? 1 : 0
    Animated.timing(animation, {
      toValue,
      duration: 250,
      useNativeDriver: false
    }).start()
    setIsHovered(hover)
  }

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 56 + contentHeight] // 56 is the heading height
  })

  if (!chainId || !LEGENDS_SUPPORTED_NETWORKS_BY_CHAIN_ID.includes(chainId)) return null

  return (
    <Animated.View
      style={[styles.container, { height: animatedHeight }]}
      // @ts-ignore
      onMouseEnter={() => toggleExpand(true)}
      onMouseLeave={() => toggleExpand(false)}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <FireIcon style={spacings.mrSm} />
        <Text
          fontSize={20}
          weight="semiBold"
          appearance="infoText"
          style={[flexbox.flex1, spacings.mrSm]}
          numberOfLines={1}
        >
          {t('Hot tip')}
        </Text>
        <View style={[{ height: 24, width: 32 }, flexbox.alignCenter, flexbox.justifyCenter]}>
          <Image source={LegendsLogo as any} style={{ width: 44, height: 44 }} />
        </View>
      </View>
      {!!isHovered && (
        <View
          style={spacings.ptSm}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout
            setContentHeight(height)
          }}
        >
          <Text fontSize={14} appearance="infoText">
            {isSmartAccount(account)
              ? t('Swap & Bridge earns you XP on this network for future rewards in ')
              : t('Making this transaction with a Smart Account would earn you XP for ')}
            <Text
              fontSize={14}
              appearance="infoText"
              underline
              weight="medium"
              onPress={() => openInTab('https://legends.ambire.com', false)}
            >
              {t('Ambire Legends!')}
            </Text>
          </Text>
        </View>
      )}
    </Animated.View>
  )
}

export default React.memo(LegendsHotTip)
