import React, { useCallback, useEffect, useMemo } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { networks } from '@ambire-common/consts/networks'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { TokenResult } from '@ambire-common/libs/portfolio/interfaces'
import { calculateTokensPendingState } from '@ambire-common/libs/portfolio/portfolioView'
import Select from '@common/components/Select/'
import Spinner from '@common/components/Spinner'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import Heading from '@web/modules/sign-account-op/components/Heading'
import PendingTokenSummary from '@web/modules/sign-account-op/components/PendingTokenSummary'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'
import { getUiType } from '@web/utils/uiType'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import styles from './styles'
import Estimation from '../../components/Estimation/Estimation'

const SignAccountOpScreen = () => {
  const { params } = useRoute()
  const { navigate } = useNavigation()
  const signAccountOpState = useSignAccountOpControllerState()
  const mainState = useMainControllerState()
  const activityState = useActivityControllerState()
  const portfolioState = usePortfolioControllerState()
  const keystoreState = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { t } = useTranslation()

  const selectedAccountFull = useMemo(() => mainState.accounts.find(
    (acc) => acc.addr === mainState.selectedAccount
  ), [mainState.accounts, mainState.selectedAccount])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const accountOpToBeSigned: any =
      mainState.accountOpsToBeSigned?.[params.accountAddr]?.[params.network.id]
    if (accountOpToBeSigned) {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_MAIN_DEPS',
        params: {
          accounts: mainState.accounts,
          accountStates: mainState.accountStates,
          networks
        }
      })
    }
  }, [
    params,
    dispatch,
    mainState.accounts,
    mainState.accountStates,
    mainState.accountOpsToBeSigned
  ])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const estimateAccountOp = () => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_ESTIMATE',
        params: {
          accountAddr: params.accountAddr,
          networkId: params.network.id
        }
      })
    }

    estimateAccountOp()
    const interval = setInterval(estimateAccountOp, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const accountOpToBeSigned: any =
      mainState.accountOpsToBeSigned?.[params.accountAddr]?.[params.network.id]

    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
      params: {
        accountOp: accountOpToBeSigned.accountOp
      }
    })
  }, [mainState.accountOpsToBeSigned, params, dispatch])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    if (!activityState.isInitialized) {
      dispatch({
        type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
        params: {
          filters: {
            account: params.accountAddr,
            network: params.network.id
          }
        }
      })
    }
  }, [activityState.isInitialized, dispatch, params])

  const account = useMemo(() => {
    return mainState.accounts.find((acc) => acc.addr === signAccountOpState.accountOp?.accountAddr)
  }, [mainState.accounts, signAccountOpState.accountOp?.accountAddr])

  const network = useMemo(() => {
    return mainState.settings.networks.find(
      (n) => n.id === signAccountOpState?.accountOp?.networkId
    )
  }, [mainState.settings.networks, signAccountOpState?.accountOp?.networkId])

  const handleRejectAccountOp = useCallback(() => {
    if (!signAccountOpState.accountOp) return

    signAccountOpState.accountOp.calls.forEach((call) => {
      if (call.fromUserRequestId)
        dispatch({
          type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
          params: { err: 'User rejected the transaction request', id: call.fromUserRequestId }
        })
    })
  }, [dispatch, signAccountOpState.accountOp])

  const handleAddToCart = useCallback(() => {
    if (getUiType().isNotification) {
      window.close()
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleChangeSigningKey = useCallback(
    (signingKeyAddr: string, signingKeyType: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: { signingKeyAddr, signingKeyType }
      })
    },
    [dispatch]
  )

  // Set the first key as the selected key
  useEffect(() => {
    const firstKey = keystoreState.keys.find((key) =>
      selectedAccountFull?.associatedKeys.includes(key.addr)
    )

    if (firstKey) {
      handleChangeSigningKey(firstKey?.addr, firstKey?.type)
    }
  }, [handleChangeSigningKey, keystoreState.keys, selectedAccountFull?.associatedKeys])

  const handleSign = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN'
    })
  }, [dispatch])

  const callsToVisualize: IrCall[] = useMemo(() => {
    if (signAccountOpState.humanReadable.length) return signAccountOpState.humanReadable
    return signAccountOpState.accountOp?.calls || []
  }, [signAccountOpState.accountOp?.calls, signAccountOpState.humanReadable])

  const pendingTokens = useMemo(() => {
    if (signAccountOpState.accountOp && network) {
      return calculateTokensPendingState(
        signAccountOpState.accountOp.accountAddr,
        network,
        portfolioState.state
      )
    }
    return []
  }, [network, portfolioState.state, signAccountOpState.accountOp])

  if (!signAccountOpState.accountOp || !network) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Spinner />
      </View>
    )
  }

  return (
    <TabLayoutWrapperMainContent
      width="full"
      forceCanGoBack
      pageTitle={<Header account={account} network={network} />}
      footer={
        <Footer
          onReject={handleRejectAccountOp}
          onAddToCart={handleAddToCart}
          onSign={handleSign}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.leftSideContainer}>
          <View style={styles.transactionsContainer}>
            <Heading text={t('Waiting Transactions')} style={styles.transactionsHeading} />
            <ScrollView style={styles.transactionsScrollView} scrollEnabled>
              {callsToVisualize.map((call) => {
                return (
                  <TransactionSummary
                    key={call.data + call.fromUserRequestId}
                    style={spacings.mbSm}
                    call={call}
                    networkId={network.id}
                    explorerUrl={network.explorerUrl}
                  />
                )
              })}
            </ScrollView>
          </View>
          <View style={styles.pendingTokensContainer}>
            <View style={styles.pendingTokensSeparatorContainer}>
              <View style={styles.separatorHorizontal} />
              <View style={styles.pendingTokensHeadingWrapper}>
                <Text weight="medium" fontSize={16}>
                  {t('Balance changes')}
                </Text>
              </View>
            </View>
            <ScrollView style={styles.pendingTokensScrollView} scrollEnabled>
              {pendingTokens.map((token) => {
                return <PendingTokenSummary token={token} networkId={network.id} />
              })}
            </ScrollView>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.estimationContainer}>
          <Heading text={t('Estimation')} style={styles.estimationHeading} />
          {signAccountOpState.availableFeeOptions.length ? (
            <Estimation networkId={network.id} />
          ) : (
            <Spinner style={styles.spinner} />
          )}
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default SignAccountOpScreen
