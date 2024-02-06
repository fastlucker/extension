import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { calculateTokensPendingState } from '@ambire-common/libs/portfolio/portfolioView'
import Alert from '@common/components/Alert'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text/'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActivityControllerState from '@web/hooks/useActivityControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'
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
  const { dispatch } = useBackgroundService()
  const { networks } = useSettingsControllerState()
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const [slowRequest, setSlowRequest] = useState<boolean>(false)
  const [initialSimulationLoaded, setInitialSimulationLoaded] = useState<boolean>(false)

  const hasEstimation = useMemo(
    () => signAccountOpState?.isInitialized && !!signAccountOpState?.gasPrices,
    [signAccountOpState?.gasPrices, signAccountOpState?.isInitialized]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasEstimation) {
        setSlowRequest(true)
      }
    }, 5000)

    if (hasEstimation) {
      clearTimeout(timeout)
      setSlowRequest(false)
    }
  }, [hasEstimation, slowRequest])

  useEffect(() => {
    if (!params?.accountAddr || !params?.network) {
      return
    }

    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_INIT',
      params: {
        accountAddr: params?.accountAddr,
        networkId: params?.network?.id
      }
    })
  }, [params, dispatch])

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

    const interval = setInterval(estimateAccountOp, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [params, dispatch])

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
    return mainState.accounts.find((acc) => acc.addr === signAccountOpState?.accountOp?.accountAddr)
  }, [mainState.accounts, signAccountOpState?.accountOp?.accountAddr])

  const network = useMemo(() => {
    return networks.find((n) => n.id === signAccountOpState?.accountOp?.networkId)
  }, [networks, signAccountOpState?.accountOp?.networkId])

  const handleRejectAccountOp = useCallback(() => {
    if (!signAccountOpState?.accountOp) return

    signAccountOpState.accountOp.calls.forEach((call) => {
      if (call.fromUserRequestId)
        dispatch({
          type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
          params: { err: 'User rejected the transaction request', id: call.fromUserRequestId }
        })
    })
  }, [dispatch, signAccountOpState?.accountOp])

  const handleAddToCart = useCallback(() => {
    if (getUiType().isNotification) {
      window.close()
    } else {
      navigate('/')
    }
  }, [navigate])

  const callsToVisualize: IrCall[] = useMemo(() => {
    if (!signAccountOpState || !signAccountOpState?.humanReadable) return []
    if (signAccountOpState.humanReadable.length) return signAccountOpState.humanReadable
    return signAccountOpState.accountOp?.calls || []
  }, [signAccountOpState])

  const pendingTokens = useMemo(() => {
    if (signAccountOpState?.accountOp && network) {
      return calculateTokensPendingState(
        signAccountOpState?.accountOp.accountAddr,
        network,
        portfolioState.state
      )
    }
    return []
  }, [network, portfolioState.state, signAccountOpState?.accountOp])

  useEffect(() => {
    const destroy = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_DESTROY' })
    }
    window.addEventListener('beforeunload', destroy)

    return () => {
      destroy()
      window.removeEventListener('beforeunload', destroy)
    }
  }, [dispatch])

  const handleSign = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_SIGN'
    })
  }, [dispatch])

  const handleChangeSigningKey = useCallback(
    (signingKeyAddr: string, signingKeyType: string) => {
      dispatch({
        type: 'MAIN_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params: { signingKeyAddr, signingKeyType }
      })

      handleSign()
    },
    [dispatch, handleSign]
  )

  const onSignButtonClick = () => {
    // If the account has only one signer, we don't need to show the select signer overlay,
    // and we will sign the transaction with the only one available signer (it is set by default in the controller).
    if (signAccountOpState?.accountKeyStoreKeys.length === 1) {
      handleSign()
      return
    }

    setIsChooseSignerShown(true)
  }

  const isViewOnly = useMemo(
    () => signAccountOpState?.accountKeyStoreKeys.length === 0,
    [signAccountOpState?.accountKeyStoreKeys]
  )

  const pendingSendTokens = useMemo(
    () => pendingTokens.filter((token) => token.type === 'send'),
    [pendingTokens]
  )

  const pendingReceiveTokens = useMemo(
    () => pendingTokens.filter((token) => token.type === 'receive'),
    [pendingTokens]
  )

  if (mainState.signAccOpInitError) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Alert type="error" title={mainState.signAccOpInitError} />
      </View>
    )
  }

  // We want to show the errors one by one.
  // Once the user resolves an error, it will be removed from the array,
  // and we are going to show the next one, if it exists.
  if (!signAccountOpState?.accountOp) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
        <Spinner />
      </View>
    )
  }

  const isSignLoading =
    signAccountOpState.status?.type === SigningStatus.InProgress ||
    signAccountOpState.status?.type === SigningStatus.Done ||
    mainState.broadcastStatus === 'LOADING'

  const portfolioStatePending =
    portfolioState.state.pending[signAccountOpState?.accountOp.accountAddr][network!.id]

  let hasSimulationError = false
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    (!!portfolioStatePending?.errors.find((err) => err.simulationErrorMsg) ||
      !!portfolioStatePending?.criticalError?.simulationErrorMsg)
  ) {
    hasSimulationError = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  let simulationErrorMsg = 'We were unable to simulate the transaction'
  if (portfolioStatePending?.criticalError)
    simulationErrorMsg = `${simulationErrorMsg}: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
  else {
    const simulationError = portfolioStatePending?.errors.find((err) => err.simulationErrorMsg)
    if (simulationError)
      simulationErrorMsg = `${simulationErrorMsg}: ${simulationError.simulationErrorMsg}`
  }

  const estimationFailed = signAccountOpState.status?.type === SigningStatus.EstimationError

  let shouldShowNoBalanceChanges = false
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    !pendingTokens.length &&
    !portfolioStatePending?.errors.length &&
    !portfolioStatePending?.criticalError
  ) {
    shouldShowNoBalanceChanges = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  let shouldShowSimulation = false
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    !!pendingTokens.length &&
    !hasSimulationError
  ) {
    shouldShowSimulation = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  return (
    <TabLayoutContainer
      width="full"
      header={
        <Header
          networkId={network!.id as any}
          isEOA={!account?.creation}
          networkName={network?.name}
        />
      }
      footer={
        <Footer
          onReject={handleRejectAccountOp}
          onAddToCart={handleAddToCart}
          isEOA={!account?.creation}
          isSignLoading={isSignLoading}
          readyToSign={signAccountOpState.readyToSign}
          isChooseSignerShown={isChooseSignerShown}
          isViewOnly={isViewOnly}
          handleChangeSigningKey={handleChangeSigningKey}
          selectedAccountKeyStoreKeys={signAccountOpState?.accountKeyStoreKeys}
          onSign={onSignButtonClick}
        />
      }
    >
      <TabLayoutWrapperMainContent scrollEnabled={false}>
        <View style={styles.container}>
          <View style={styles.leftSideContainer}>
            <View style={styles.simulationSection}>
              <Text fontSize={20} weight="medium" style={spacings.mbLg}>
                {t('Simulation results')}
              </Text>
              {shouldShowSimulation && (
                <View style={[flexbox.directionRow, flexbox.flex1]}>
                  {!!pendingSendTokens.length && (
                    <View
                      style={[
                        styles.simulationContainer,
                        !!pendingReceiveTokens.length && spacings.mrTy
                      ]}
                    >
                      <View style={styles.simulationContainerHeader}>
                        <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                          {t('Tokens out')}
                        </Text>
                      </View>
                      <ScrollView
                        style={styles.simulationScrollView}
                        contentContainerStyle={{ flexGrow: 1 }}
                        scrollEnabled
                      >
                        {pendingSendTokens.map((token, i) => {
                          return (
                            <PendingTokenSummary
                              key={token.address}
                              token={token}
                              networkId={network!.id}
                              hasBottomSpacing={i < pendingTokens.length - 1}
                            />
                          )
                        })}
                      </ScrollView>
                    </View>
                  )}
                  {!!pendingReceiveTokens.length && (
                    <View style={styles.simulationContainer}>
                      <View style={styles.simulationContainerHeader}>
                        <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                          {t('Tokens in')}
                        </Text>
                      </View>
                      <ScrollView style={styles.simulationScrollView} scrollEnabled>
                        {pendingReceiveTokens.map((token, i) => {
                          return (
                            <PendingTokenSummary
                              key={token.address}
                              token={token}
                              networkId={network!.id}
                              hasBottomSpacing={i < pendingTokens.length - 1}
                            />
                          )
                        })}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
              {hasSimulationError && (
                <View>
                  <Alert type="error" title={simulationErrorMsg} />
                </View>
              )}
              {shouldShowNoBalanceChanges && (
                <View>
                  <Alert
                    type="info"
                    isTypeLabelHidden
                    title={
                      <>
                        No token balance changes detected. Please{' '}
                        <Text appearance="infoText" weight="semiBold">
                          carefully
                        </Text>{' '}
                        review the transaction preview below.
                      </>
                    }
                  />
                </View>
              )}
              {portfolioStatePending?.isLoading && !initialSimulationLoaded && (
                <View style={spacings.mt}>
                  <Spinner style={styles.spinner} />
                </View>
              )}
            </View>
            <View style={styles.transactionsContainer}>
              <Text fontSize={20} weight="medium" style={spacings.mbLg}>
                {t('Waiting Transactions')}
              </Text>
              <ScrollView style={styles.transactionsScrollView} scrollEnabled>
                {callsToVisualize.map((call, i) => {
                  return (
                    <TransactionSummary
                      key={call.data + call.fromUserRequestId}
                      style={i !== callsToVisualize.length - 1 ? spacings.mbSm : {}}
                      call={call}
                      networkId={network!.id}
                      explorerUrl={network!.explorerUrl}
                    />
                  )
                })}
              </ScrollView>
            </View>
          </View>
          <View
            style={[
              styles.separator,
              IS_SCREEN_SIZE_DESKTOP_LARGE
                ? { ...spacings.mr3Xl, ...spacings.ml2Xl }
                : { ...spacings.mrXl, ...spacings.ml }
            ]}
          />
          <View style={styles.estimationContainer}>
            <Text fontSize={20} weight="medium" style={spacings.mbLg}>
              {t('Estimation')}
            </Text>
            <ScrollView style={styles.estimationScrollView} contentContainerStyle={{ flexGrow: 1 }}>
              {hasEstimation && !estimationFailed && (
                <Estimation
                  mainState={mainState}
                  signAccountOpState={signAccountOpState}
                  accountPortfolio={portfolioState.accountPortfolio}
                  networkId={network!.id}
                  disabled={isViewOnly || isSignLoading}
                />
              )}
              {!hasEstimation && !estimationFailed && (
                <View style={[StyleSheet.absoluteFill, flexbox.alignCenter, flexbox.justifyCenter]}>
                  <Spinner style={styles.spinner} />
                </View>
              )}

              {!hasEstimation && slowRequest && !signAccountOpState?.errors.length ? (
                <View style={styles.errorContainer}>
                  <Alert
                    type="warning"
                    title="Estimating this transaction is taking an unexpectedly long time. We'll keep trying, but it is possible that there's an issue with this network or RPC - please change your RPC provider or contact Ambire support if this issue persists."
                  />
                </View>
              ) : null}

              {signAccountOpState?.errors.length ? (
                <View style={styles.errorContainer}>
                  <Alert type="error" title={signAccountOpState?.errors[0]} />
                </View>
              ) : null}
            </ScrollView>
          </View>
          {signAccountOpState.accountOp.signingKeyType !== 'internal' && (
            <HardwareWalletSigningModal
              isOpen={isSignLoading}
              keyType={signAccountOpState.accountOp.signingKeyType}
              onReject={handleRejectAccountOp}
            />
          )}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default SignAccountOpScreen
