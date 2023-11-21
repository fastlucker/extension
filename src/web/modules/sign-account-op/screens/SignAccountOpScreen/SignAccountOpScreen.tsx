import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { calculateTokensPendingState } from '@ambire-common/libs/portfolio/portfolioView'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text/'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import Footer from '@web/modules/sign-account-op/components/Footer'
import Header from '@web/modules/sign-account-op/components/Header'
import PendingTokenSummary from '@web/modules/sign-account-op/components/PendingTokenSummary'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const SignAccountOpScreen = () => {
  const { params } = useRoute()
  const { navigate } = useNavigation()
  const signAccountOpState = useSignAccountOpControllerState()
  const mainState = useMainControllerState()
  const activityState = useActivityControllerState()
  const portfolioState = usePortfolioControllerState()
  const keystoreState = useKeystoreControllerState()
  const { dispatch } = useBackgroundService()
  const { networks } = useSettingsControllerState()

  const { t } = useTranslation()
  const { styles, theme } = useTheme(getStyles)
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)

  const hasEstimation = useMemo(
    () => !!signAccountOpState.availableFeeOptions.length,
    [signAccountOpState.availableFeeOptions]
  )

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const accountOpToBeSigned: any =
      mainState.accountOpsToBeSigned?.[params.accountAddr]?.[params.network.id]

    if (
      accountOpToBeSigned &&
      mainState.accounts &&
      Object.keys(mainState.accountStates || {}).length
    ) {
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
    networks,
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
  }, [params, dispatch])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    const accountOpToBeSigned: any =
      mainState.accountOpsToBeSigned?.[params.accountAddr]?.[params.network.id]

    if (accountOpToBeSigned) {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: {
          accountOp: accountOpToBeSigned.accountOp
        }
      })
    }
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
    return networks.find((n) => n.id === signAccountOpState?.accountOp?.networkId)
  }, [networks, signAccountOpState?.accountOp?.networkId])

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

  useEffect(() => {
    const reset = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_RESET' })
    }
    window.addEventListener('beforeunload', reset)

    return () => {
      reset()
      window.removeEventListener('beforeunload', reset)
    }
  }, [dispatch])

  const handleSign = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN'
    })
  }, [dispatch])

  useEffect(() => {
    if (
      signAccountOpState.isInitialized &&
      signAccountOpState.status?.type === SigningStatus.ReadyToSign &&
      signAccountOpState.accountOp?.signingKeyAddr &&
      signAccountOpState.accountOp?.signingKeyType
    ) {
      handleSign()
    }
  }, [
    handleSign,
    signAccountOpState.accountOp?.signingKeyAddr,
    signAccountOpState.accountOp?.signingKeyType,
    signAccountOpState.isInitialized,
    signAccountOpState.status?.type
  ])

  const selectedAccountKeyStoreKeys = useMemo(
    () => keystoreState.keys.filter((key) => account?.associatedKeys.includes(key.addr)),
    [account?.associatedKeys, keystoreState.keys]
  )

  const onSignButtonClick = () => {
    // If the account has only one signer, we don't need to show the select signer overlay
    if (selectedAccountKeyStoreKeys.length === 1) {
      handleChangeSigningKey(
        selectedAccountKeyStoreKeys[0].addr,
        selectedAccountKeyStoreKeys[0].type
      )
      return
    }

    setIsChooseSignerShown(true)
  }

  const isViewOnly = useMemo(
    () => selectedAccountKeyStoreKeys.length === 0,
    [selectedAccountKeyStoreKeys.length]
  )

  if (!signAccountOpState.accountOp || !network) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Spinner />
      </View>
    )
  }

  return (
    <TabLayoutContainer
      width="full"
      header={
        <Header
          networkId={network.id as any}
          isEOA={!account?.creation}
          networkName={network.name}
        />
      }
      footer={
        <Footer
          onReject={handleRejectAccountOp}
          onAddToCart={handleAddToCart}
          isEOA={!account?.creation}
          isSignLoading={
            signAccountOpState.status?.type === SigningStatus.InProgress ||
            signAccountOpState.status?.type === SigningStatus.InProgressAwaitingUserInput ||
            signAccountOpState.status?.type === SigningStatus.Done ||
            mainState.broadcastStatus === 'LOADING'
          }
          isChooseSignerShown={isChooseSignerShown}
          isViewOnly={isViewOnly}
          handleChangeSigningKey={handleChangeSigningKey}
          selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
          onSign={onSignButtonClick}
        />
      }
    >
      <TabLayoutWrapperMainContent>
        <View style={styles.container}>
          <View style={styles.leftSideContainer}>
            <View style={styles.transactionsContainer}>
              <Text fontSize={20} weight="medium" style={spacings.mbXl}>
                {t('Waiting Transactions')}
              </Text>
              <ScrollView style={styles.transactionsScrollView} scrollEnabled>
                {callsToVisualize.map((call, i) => {
                  return (
                    <TransactionSummary
                      key={call.data + call.fromUserRequestId}
                      style={i !== callsToVisualize.length - 1 ? spacings.mbSm : {}}
                      call={call}
                      networkId={network.id}
                      explorerUrl={network.explorerUrl}
                    />
                  )
                })}
              </ScrollView>
            </View>
            {!!pendingTokens.length && (
              <View style={flexbox.flex1}>
                <View style={spacings.pr}>
                  <View style={styles.pendingTokensSeparatorContainer}>
                    <View style={styles.separatorHorizontal} />
                    <View style={styles.pendingTokensHeadingWrapper}>
                      <Text fontSize={16} color={theme.secondaryText} weight="medium">
                        {t('Balance changes')}
                      </Text>
                    </View>
                  </View>
                </View>

                <ScrollView style={styles.pendingTokensScrollView} scrollEnabled>
                  {pendingTokens.map((token) => {
                    return (
                      <PendingTokenSummary
                        key={token.address}
                        token={token}
                        networkId={network.id}
                      />
                    )
                  })}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={styles.separator} />
          <View style={styles.estimationContainer}>
            <Text fontSize={20} weight="medium" style={spacings.mbXl}>
              {t('Estimation')}
            </Text>
            {hasEstimation ? (
              <Estimation networkId={network.id} isViewOnly={isViewOnly} />
            ) : (
              <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
                <Spinner style={styles.spinner} />
              </View>
            )}
          </View>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default SignAccountOpScreen
