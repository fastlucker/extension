import { Account } from 'ambire-common/src/interfaces/account'
import { TokenResult } from 'ambire-common/src/libs/portfolio/interfaces'
import React, { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import NetworkIcon from '@common/components/NetworkIcon'
import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import networks from '@common/constants/networks'
import useNavigation from '@common/hooks/useNavigation'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import CustomFee from '@web/modules/sign-account-op/components/CustomFee'
import Fee from '@web/modules/sign-account-op/components/Fee'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import Heading from '@web/modules/sign-account-op/components/Heading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import styles from './styles'

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

const mapTokenOptions = (values: TokenResult[]) =>
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

const SignAccountOpScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const mappedAccounts = mapAccountOptions(ACCOUNTS as Account[])
  const mappedTokens = mapTokenOptions(TOKENS as TokenResult[])

  const { control } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      account: mappedAccounts[0],
      token: mappedTokens[0]
    }
  })
  const onBack = useCallback(() => {
    navigate(ROUTES.transfer)
  }, [])

  return (
    <TabLayoutWrapperMainContent
      width="full"
      forceCanGoBack
      onBack={onBack}
      pageTitle={<Header />}
      footer={<Footer />}
    >
      <View style={styles.container}>
        <View style={styles.transactionsContainer}>
          <Heading text={t('Waiting Transactions')} style={styles.transactionsHeading} />
          <ScrollView style={styles.transactionsScrollView} scrollEnabled>
            <TransactionSummary style={spacings.mbSm} />
            <TransactionSummary style={spacings.mbSm} />
            <TransactionSummary style={spacings.mbSm} />
          </ScrollView>
        </View>
        <View style={styles.separator} />
        <View style={styles.estimationContainer}>
          <Heading text={t('Estimation')} style={styles.estimationHeading} />
          <Controller
            name="account"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                setValue={onChange}
                label={t('Fee paid by')}
                options={mappedAccounts}
                style={styles.accountSelect}
                labelStyle={styles.accountSelectLabel}
                value={value}
                defaultValue={value}
              />
            )}
          />
          <Controller
            name="token"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                setValue={onChange}
                label={t('Pay fee with')}
                options={mappedTokens}
                style={styles.tokenSelect}
                labelStyle={styles.tokenSelectLabel}
                value={value}
                defaultValue={value}
              />
            )}
          />
          <View style={styles.transactionSpeedContainer}>
            <Text style={styles.transactionSpeedLabel}>Transaction speed:</Text>
            <View style={styles.feesContainer}>
              <Fee
                label={`${t('Slow')}:`}
                amount={0.01234567}
                onPress={() => {}}
                style={styles.mr10}
              />
              <Fee
                label={`${t('Medium')}:`}
                amount={0.02345678}
                onPress={() => {}}
                style={styles.mr10}
              />
              <Fee
                label={`${t('Fast')}:`}
                amount={0.03456789}
                onPress={() => {}}
                style={styles.mr10}
              />
              <Fee
                label={`${t('Ape')}:`}
                amount={0.04567999}
                onPress={() => {}}
                style={styles.mr10}
              />
              <CustomFee onPress={() => {}} />
            </View>
          </View>
          <View>
            <View style={styles.feeContainer}>
              <Text style={styles.fee}>{t('Fee')}: 0.01447743207351446 $WALLET</Text>
              <Text style={styles.feeUsd}>~ $ 0.02</Text>
            </View>
            <View style={styles.gasTankContainer}>
              <Text style={styles.gasTankText}>{t('Gas Tank saves you:')}</Text>
              <Text style={styles.gasTankText}>$ 2.6065</Text>
            </View>
          </View>
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default SignAccountOpScreen
