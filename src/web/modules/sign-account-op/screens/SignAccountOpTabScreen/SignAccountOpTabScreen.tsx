import React, { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import Select from '@common/components/Select/'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import CustomFee from '@web/modules/sign-account-op/components/CustomFee'
import Fee from '@web/modules/sign-account-op/components/Fee'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import Heading from '@web/modules/sign-account-op/components/Heading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import styles from './styles'

interface Props {
  tokens: any[]
  accounts: any[]
  onBack: () => void
}

const SignAccountOpTabScreen: FC<Props> = ({ tokens, accounts, onBack }) => {
  const { t } = useTranslation()

  const { control } = useForm({
    reValidateMode: 'onChange',
    defaultValues: {
      account: accounts[0],
      token: tokens[0]
    }
  })

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
                options={accounts}
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
                options={tokens}
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

export default SignAccountOpTabScreen
