import { Account } from 'ambire-common/src/interfaces/account'
import { TokenResult } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { useCallback } from 'react'
import { View } from 'react-native'

import NetworkIcon from '@common/components/NetworkIcon'
import Text from '@common/components/Text'
import networks from '@common/constants/networks'
import useNavigation from '@common/hooks/useNavigation'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import { ROUTES } from '@common/modules/router/constants/common'
import { getUiType } from '@web/utils/uiType'

import SignAccountOpPopupScreen from '../SignAccountOpPopupScreen'
import SignAccountOpTabScreen from '../SignAccountOpTabScreen'

// @TODO: - get accounts from controller
const ACCOUNTS = [
  {
    addr: '0xe1B0aB5DfBbBb7eAeC1FfBfE3B5e4FfFfFfFfFfF',
    label: 'Account.Name.eth',
    pfp: 'https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600'
  },
  {
    addr: '0x2',
    label: '0x2.eth',
    pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTiA3zMVkqgS_qHXKNkxgDs4IYwc387AMfesyPxHerLdt0dLiu7Zs8UfCsEmz7wSLqfz4&usqp=CAU'
  }
]

// @TODO: - get tokens from portfolio based on currently selected account
const TOKENS = [
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    networkId: 'ethereum'
  },
  {
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    symbol: 'MATIC',
    networkId: 'polygon'
  }
]

const mapAccountOptions = (values: Account[]) =>
  values.map((value) => ({
    value: value.addr,
    label: <Text weight="medium">{value.label}</Text>,
    icon: value.pfp
  }))

export const mapTokenOptions = (values: TokenResult[]) =>
  values.map((value) => ({
    value: value.address,
    label: (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TokenIcon
          containerHeight={30}
          containerWidth={30}
          withContainer
          address={value.address}
          networkId={value.networkId}
        />
        <Text weight="medium" style={{ marginLeft: 10 }}>
          {value.symbol}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
          <Text fontSize={14}>on</Text>
          <NetworkIcon name={value.networkId} />
          <Text fontSize={14}>
            {networks.find((network) => network.id === value?.networkId)?.name}
          </Text>
        </View>
      </View>
    ),
    icon: null
  }))

const isTab = getUiType().isTab

const SignAccountOpScreen = () => {
  const { navigate } = useNavigation()

  const mappedAccounts = mapAccountOptions(ACCOUNTS as Account[])
  const mappedTokens = mapTokenOptions(TOKENS as TokenResult[])

  const onBack = useCallback(() => {
    navigate(ROUTES.transfer)
  }, [navigate])

  return isTab ? (
    <SignAccountOpTabScreen onBack={onBack} tokens={mappedTokens} accounts={mappedAccounts} />
  ) : (
    <SignAccountOpPopupScreen tokens={mappedTokens} />
  )
}

export default SignAccountOpScreen
