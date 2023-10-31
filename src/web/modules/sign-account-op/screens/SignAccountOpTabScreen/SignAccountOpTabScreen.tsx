import React, { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import Select from '@common/components/Select/'
import { OptionType } from '@common/components/Select/Select.web'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import Heading from '@web/modules/sign-account-op/components/Heading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import Fees from '../../components/Fees/Fees'
import styles from './styles'

interface Props {
  tokens: OptionType[]
  accounts: OptionType[]
}

const SignAccountOpTabScreen: FC<Props> = ({ tokens, accounts }) => {
  const { t } = useTranslation()

  const { control } = useForm({
    mode: 'all',
    defaultValues: {
      account: accounts[0] || {},
      token: tokens[0] || {}
    }
  })

  return (
    <TabLayoutWrapperMainContent
      width="full"
      forceCanGoBack
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
          <Fees control={control} tokens={tokens} />
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default SignAccountOpTabScreen
