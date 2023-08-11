import React from 'react'
import { View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const Routes = () => {
  const IconWrapper = ({
    onPress,
    children
  }: {
    onPress: () => void
    children: React.ReactNode
  }) => (
    <NavIconWrapper
      // TODO: handle on press and routing to different pages
      onPress={onPress}
      hoverBackground={colors.violet}
      hoverColor={colors.white}
      style={{ backgroundColor: colors.melrose_35, borderColor: colors.violet, ...spacings.mbMi }}
    >
      {children}
    </NavIconWrapper>
  )

  const { t } = useTranslation()
  return (
    <View style={[flexbox.directionRow]}>
      <View style={[flexbox.alignCenter, spacings.mrTy]}>
        <IconWrapper onPress={() => null}>
          <SwapIcon width={20} height={20} />
        </IconWrapper>
        <Text weight="regular" shouldScale={false} fontSize={12}>
          {t('Swap')}
        </Text>
      </View>
      <View style={[flexbox.alignCenter, spacings.mrTy]}>
        <IconWrapper onPress={() => null}>
          <BridgeIcon width={20} height={20} />
        </IconWrapper>
        <Text weight="regular" shouldScale={false} fontSize={12}>
          {t('Bridge')}
        </Text>
      </View>
      <View style={[flexbox.alignCenter, spacings.mrTy]}>
        <IconWrapper onPress={() => null}>
          <SendIcon width={20} height={20} />
        </IconWrapper>
        <Text weight="regular" shouldScale={false} fontSize={12}>
          {t('Send')}
        </Text>
      </View>
      <View style={[flexbox.alignCenter, spacings.mrTy]}>
        <IconWrapper onPress={() => null}>
          <TopUpIcon width={20} height={20} />
        </IconWrapper>
        <Text weight="regular" shouldScale={false} fontSize={12}>
          {t('Top up')}
        </Text>
      </View>
      <View style={[flexbox.alignCenter]}>
        <IconWrapper onPress={() => null}>
          <EarnIcon width={20} height={20} />
        </IconWrapper>
        <Text weight="regular" shouldScale={false} fontSize={12}>
          {t('Earn')}
        </Text>
      </View>
    </View>
  )
}

export default Routes
