import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

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

import Assets from '../components/Assets'

const DashboardScreen = () => {
  const [type, setType] = useState('tokens')
  const tokens = [
    {
      type: 'token',
      address: '0x88800092ff476844f74dc2fc427974bbee2794ae',
      decimals: 18,
      symbol: 'WALLET',
      name: 'Ambire Wallet',
      coingeckoId: 'ambire-wallet',
      network: 'ethereum',
      tokenImageUrl:
        'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/logos/Ambire_logo_250x250.png',
      tokenImageUrls: {
        large:
          'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/logos/Ambire_logo_250x250.png'
      },
      balance: 132366,
      balanceRaw: '132366000000000000000000',
      price: 0.00773565,
      balanceUSD: 1023.9370479,
      priceUpdate: 1691152425637,
      balanceUpdate: 1691153940047
    },
    {
      type: 'token',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      symbol: 'ETH',
      name: 'Ethereum',
      coingeckoId: 'ethereum',
      network: 'ethereum',
      tokenImageUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
      tokenImageUrls: {
        thumb: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png?1595348880',
        small: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        large: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
      },
      balance: 0.002232367622731011,
      balanceRaw: '2232367622731011',
      price: 1833.65,
      balanceUSD: 4.093380891420718,
      priceUpdate: 1691152186113,
      balanceUpdate: 1691153940047
    },
    {
      type: 'token',
      address: '0x47cd7e91c3cbaaf266369fe8518345fc4fc12935',
      decimals: 18,
      symbol: 'XWALLET',
      network: 'ethereum',
      name: 'Ambire Wallet Staking Token',
      coingeckoId: 'ambire-xwallet',
      tokenImageUrl:
        'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/logos/xwallet_250x250.png',
      tokenImageUrls: {
        large:
          'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/logos/xwallet_250x250.png'
      },
      balance: 9585.375931938657,
      balanceRaw: '9585375931938656910241',
      price: 0.13062027923827124,
      balanceUSD: 1252.044480833632,
      priceUpdate: 1691153895319,
      balanceUpdate: 1691153940047
    }
  ]
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
      contentContainerStyle={[spacings.pv0, spacings.ph0]}
      style={{ backgroundColor: 'white', flex: 1 }}
    >
      <View style={[flexbox.directionRow, flexbox.justifySpaceBetween, spacings.ph, spacings.pv]}>
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
      <View style={[flexbox.flex1]}>
        <View style={[flexbox.directionRow, spacings.ph]}>
          <Pressable onPress={() => setType('tokens')}>
            <View
              style={{
                borderBottomColor: type === 'tokens' ? colors.violet : 'transparent',
                borderBottomWidth: 2,
                width: 150,
                ...flexbox.alignCenter
              }}
            >
              <Text
                shouldScale={false}
                weight="regular"
                color={type === 'tokens' ? colors.violet : colors.martinique_65}
                fontSize={20}
              >
                Tokens
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={() => setType('collectibles')}>
            <View
              style={{
                borderBottomColor: type === 'collectibles' ? colors.violet : 'transparent',
                borderBottomWidth: 2,
                width: 150,
                ...flexbox.alignCenter
              }}
            >
              <Text
                shouldScale={false}
                weight="regular"
                color={type === 'collectibles' ? colors.violet : colors.martinique_65}
                fontSize={20}
              >
                Collectibles
              </Text>
            </View>
          </Pressable>
          <TextInput
            editable
            multiline
            numberOfLines={1}
            maxLength={25}
            placeholder="Miro"
            // onChangeText={(text) => onChangeText(text)}
            // style={[styles.textarea]}
            placeholderTextColor={colors.martinique_65}
          />
        </View>

        <Assets tokens={tokens} />
      </View>
    </Wrapper>
  )
}

export default DashboardScreen
