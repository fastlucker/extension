import { networks } from 'ambire-common/src/consts/networks'
import React, { FC, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, View } from 'react-native'

import Select from '@common/components/Select/'
import { OptionType } from '@common/components/Select/Select.web'
import { useTranslation } from '@common/config/localization'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import Heading from '@web/modules/sign-account-op/components/Heading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'
import { getUiType } from '@web/utils/uiType'

import Fees from '../../components/Fees/Fees'
import styles from './styles'

interface Props {
  tokens: OptionType[]
  accounts: OptionType[]
}

const SignAccountOpTabScreen: FC<Props> = ({ tokens, accounts }) => {
  const { t } = useTranslation()
  const signAccountOpState = useSignAccountOpControllerState()
  const mainState = useMainControllerState()
  const { dispatch } = useBackgroundService()
  const { params } = useRoute()

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const accountOpToBeSigned: any =
      mainState.accountOpsToBeSigned?.[params.accountAddr]?.[params.network.id] || []
    if (accountOpToBeSigned) {
      if (!signAccountOpState.accountOp) {
        dispatch({
          type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
          params: {
            filters: {
              account: params.accountAddr,
              network: params.network.id
            }
          }
        })

        dispatch({
          type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
          params: {
            accounts: mainState.accounts,
            accountStates: mainState.accountStates,
            networks,
            estimation: accountOpToBeSigned.estimation,
            accountOp: accountOpToBeSigned.accountOp
            // gasPrices
            // feeTokenAddr
          }
        })
      }
    }
  }, [
    params,
    dispatch,
    mainState.messagesToBeSigned,
    mainState.selectedAccount,
    mainState.accounts,
    mainState.accountStates,
    mainState.accountOpsToBeSigned,
    signAccountOpState.accountOp
  ])

  useEffect(() => {
    if (!getUiType().isNotification) return
    const reset = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
    window.addEventListener('beforeunload', reset)

    return () => {
      window.removeEventListener('beforeunload', reset)
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
  }, [dispatch])

  const { control } = useForm({
    reValidateMode: 'onChange',
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
