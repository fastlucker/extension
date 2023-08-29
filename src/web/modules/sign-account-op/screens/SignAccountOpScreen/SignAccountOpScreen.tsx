import React, { useCallback } from 'react'
import { ScrollView, View } from 'react-native'

import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import Select from '@common/components/Select/'
import { Controller, useForm } from 'react-hook-form'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'
import Header from '@web/modules/sign-account-op/components/Header'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Heading from '@web/modules/sign-account-op/components/Heading'
import Fee from '@web/modules/sign-account-op/components/Fee'
import CustomFee from '@web/modules/sign-account-op/components/CustomFee'
import styles from './styles'

// @TODO: - get accounts from controller
const ACCOUNTS = [
  {
    label: 'Account.Name.eth',
    value: '0x',
    icon: (
      <img
        alt="Account 0x"
        src="https://mars-images.imgix.net/nft/1629012092532.png?auto=compress&w=600"
      />
    )
  },
  {
    label: '0x2.eth',
    value: '0x2',
    icon: (
      <img
        alt="Account 0x2.eth"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTiA3zMVkqgS_qHXKNkxgDs4IYwc387AMfesyPxHerLdt0dLiu7Zs8UfCsEmz7wSLqfz4&usqp=CAU"
      />
    )
  }
]

// @TODO: - get tokens from portfolio based on currently selected account
const TOKENS = [
  {
    // @TODO: - we need to show network icon in front of network name,
    //   https://github.com/AmbireTech/ambire-app/pull/1170#discussion_r1293243396
    label: 'USDC on Ethereum',
    value: 'usdc',
    icon: (
      <img
        alt="USDC on Ethereum"
        src="https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
      />
    )
  },
  {
    label: 'Matic on Polygon',
    value: 'matic',
    icon: (
      <img
        alt="Matic on Polygon"
        src="https://storage.googleapis.com/zapper-fi-assets/tokens/polygon/0x0000000000000000000000000000000000001010.png"
      />
    )
  }
]

const SignAccountOpScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  const { control } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      account: ACCOUNTS[0],
      token: TOKENS[0]
    }
  })
  const onBack = useCallback(() => {
    navigate(ROUTES.transfer)
  }, [])

  return (
    <AuthLayoutWrapperMainContent
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
                options={ACCOUNTS}
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
                options={TOKENS}
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
    </AuthLayoutWrapperMainContent>
  )
}

export default SignAccountOpScreen
