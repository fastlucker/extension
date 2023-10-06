import React, { useEffect } from 'react'

import { Account } from '@ambire-common/interfaces/account'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import { mapTokenOptions } from '@web/utils/maps'

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

const SignAccountOpScreen = () => {
  const { params } = useRoute()
  const { navigate } = useNavigation()

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      navigate('/')
    }
  }, [params?.accountAddr, params?.network, navigate])

  const mappedAccounts = mapAccountOptions(ACCOUNTS as Account[])
  const mappedTokens = mapTokenOptions(TOKENS as TokenResult[])

  return <SignAccountOpTabScreen tokens={mappedTokens} accounts={mappedAccounts} />
}

export default SignAccountOpScreen
