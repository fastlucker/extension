import React from 'react'
import { View } from 'react-native'

import BridgeIcon from '@common/assets/svg/BridgeIcon'
import EarnIcon from '@common/assets/svg/EarnIcon'
import SendIcon from '@common/assets/svg/SendIcon'
import SwapIcon from '@common/assets/svg/SwapIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import NavIconWrapper from '@common/components/NavIconWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

const DashboardScreen = () => {
  const IconWrapper = ({ children }) => (
    <NavIconWrapper
      hoveredBackground={colors.violet}
      style={{ backgroundColor: colors.melrose_35, borderColor: colors.violet, ...spacings.mbMi }}
    >
      {children}
    </NavIconWrapper>
  )
  const { t } = useTranslation()
  const totalBalance = 20500.9
  return (
    <Wrapper
      contentContainerStyle={[spacings.pv, spacings.ph]}
      style={{ backgroundColor: 'white', flex: 1 }}
    >
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
        <View>
          <Text color={colors.martinique_65} shouldScale={false} weight="regular" fontSize={20}>
            {t('Balance')}
          </Text>
          <View style={[flexbox.directionRow, flexbox.alignEnd]}>
            <Text fontSize={36} shouldScale={false} style={{ lineHeight: 44 }} weight="regular">
              $ {Number(totalBalance.toFixed(2).split('.')[0]).toLocaleString('en-US')}
            </Text>
            <Text fontSize={23} shouldScale={false} weight="regular">
              .{Number(totalBalance.toFixed(2).split('.')[1])}
            </Text>
          </View>
        </View>
        <View style={[flexbox.directionRow]}>
          <View style={[flexbox.alignCenter, spacings.mrTy]}>
            <IconWrapper>
              <SwapIcon />
            </IconWrapper>
            <Text weight="regular" shouldScale={false} fontSize={14}>
              {t('Swap')}
            </Text>
          </View>
          <View style={[flexbox.alignCenter, spacings.mrTy]}>
            <IconWrapper>
              <BridgeIcon />
            </IconWrapper>
            <Text weight="regular" shouldScale={false} fontSize={14}>
              {t('Bridge')}
            </Text>
          </View>
          <View style={[flexbox.alignCenter, spacings.mrTy]}>
            <IconWrapper>
              <SendIcon />
            </IconWrapper>
            <Text weight="regular" shouldScale={false} fontSize={14}>
              {t('Send')}
            </Text>
          </View>
          <View style={[flexbox.alignCenter, spacings.mrTy]}>
            <IconWrapper>
              <TopUpIcon />
            </IconWrapper>
            <Text weight="regular" shouldScale={false} fontSize={14}>
              {t('Top up')}
            </Text>
          </View>
          <View style={[flexbox.alignCenter]}>
            <IconWrapper>
              <EarnIcon />
            </IconWrapper>
            <Text weight="regular" shouldScale={false} fontSize={14}>
              {t('Earn')}
            </Text>
          </View>
        </View>
      </View>
      <View />
    </Wrapper>
  )
}

export default DashboardScreen
