import { isHexString } from 'ethers'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import Alert from '@common/components/Alert'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import PendingTokenSummary from '@web/modules/sign-account-op/components/PendingTokenSummary'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'

import SimulationSkeleton from './SimulationSkeleton'
import getStyles from './styles'

interface Props {
  network?: Network
  hasEstimation: boolean
}

const Simulation: FC<Props> = ({ network, hasEstimation }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const signAccountOpState = useSignAccountOpControllerState()
  const portfolioState = usePortfolioControllerState()
  const [initialSimulationLoaded, setInitialSimulationLoaded] = useState(false)

  const pendingTokens = useMemo(() => {
    if (signAccountOpState?.accountOp && network) {
      const pendingData =
        portfolioState.state.pending[signAccountOpState.accountOp.accountAddr][network.id]

      if (!pendingData || !pendingData.isReady || !pendingData.result) {
        return []
      }

      return pendingData.result.tokens.filter((token) => token.simulationAmount !== undefined)
    }
    return []
  }, [network, portfolioState.state, signAccountOpState?.accountOp])

  const portfolioStatePending = useMemo(() => {
    if (!signAccountOpState?.accountOp || !network?.id) return null

    return portfolioState.state.pending[signAccountOpState.accountOp.accountAddr][network?.id]
  }, [network, portfolioState.state.pending, signAccountOpState?.accountOp])

  const pendingSendTokens = useMemo(
    () => pendingTokens.filter((token) => token.simulationAmount! < 0),
    [pendingTokens]
  )

  const pendingReceiveTokens = useMemo(
    () => pendingTokens.filter((token) => token.simulationAmount! > 0),
    [pendingTokens]
  )

  const isReloading = useMemo(
    () => initialSimulationLoaded && !hasEstimation,
    [hasEstimation, initialSimulationLoaded]
  )

  const hasSimulationError = useMemo(() => {
    return (
      (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
      (!!portfolioStatePending?.errors.find((err) => err.simulationErrorMsg) ||
        !!portfolioStatePending?.criticalError?.simulationErrorMsg)
    )
  }, [
    initialSimulationLoaded,
    portfolioStatePending?.criticalError?.simulationErrorMsg,
    portfolioStatePending?.errors,
    portfolioStatePending?.isLoading
  ])

  const simulationErrorMsg = useMemo(() => {
    let errorMsg = 'We were unable to simulate the transaction'
    if (portfolioStatePending?.criticalError) {
      if (isHexString(portfolioStatePending?.criticalError.simulationErrorMsg)) {
        errorMsg = `${errorMsg}. Please report this error to our team: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
      } else {
        errorMsg = `${errorMsg}: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
      }
    } else {
      const simulationError = portfolioStatePending?.errors.find((err) => err.simulationErrorMsg)
      if (simulationError) {
        if (isHexString(simulationError)) {
          errorMsg = `${errorMsg}. Please report this error to our team: ${simulationError.simulationErrorMsg}`
        } else {
          errorMsg = `${errorMsg}: ${simulationError.simulationErrorMsg}`
        }
      }
    }
    return errorMsg
  }, [portfolioStatePending?.criticalError, portfolioStatePending?.errors])

  const shouldShowLoader = useMemo(
    () =>
      (!!portfolioStatePending?.isLoading && !initialSimulationLoaded) ||
      isReloading ||
      !signAccountOpState?.isInitialized,
    [
      initialSimulationLoaded,
      isReloading,
      portfolioStatePending?.isLoading,
      signAccountOpState?.isInitialized
    ]
  )

  const simulationView: 'no-changes' | 'changes' | null = useMemo(() => {
    if (shouldShowLoader || !signAccountOpState?.isInitialized || hasSimulationError) return null

    return pendingTokens.length ? 'changes' : 'no-changes'
  }, [
    hasSimulationError,
    pendingTokens.length,
    shouldShowLoader,
    signAccountOpState?.isInitialized
  ])

  useEffect(() => {
    if (simulationView && !initialSimulationLoaded) {
      setInitialSimulationLoaded(true)
    }
  }, [initialSimulationLoaded, simulationView])

  return (
    <View style={styles.simulationSection}>
      <SectionHeading>{t('Simulation results')}</SectionHeading>
      {simulationView === 'changes' && (
        <View style={[flexbox.directionRow, flexbox.flex1]}>
          {!!pendingSendTokens.length && (
            <View
              style={[styles.simulationContainer, !!pendingReceiveTokens.length && spacings.mrTy]}
            >
              <View style={styles.simulationContainerHeader}>
                <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                  {t('Tokens out')}
                </Text>
              </View>
              <ScrollableWrapper
                style={styles.simulationScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {pendingSendTokens.map((token, i) => {
                  return (
                    <PendingTokenSummary
                      key={token.address}
                      token={token}
                      networkId={network?.id || ''}
                      hasBottomSpacing={i < pendingTokens.length - 1}
                    />
                  )
                })}
              </ScrollableWrapper>
            </View>
          )}
          {!!pendingReceiveTokens.length && (
            <View style={styles.simulationContainer}>
              <View style={styles.simulationContainerHeader}>
                <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                  {t('Tokens in')}
                </Text>
              </View>
              <ScrollableWrapper
                style={styles.simulationScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {pendingReceiveTokens.map((token, i) => {
                  return (
                    <PendingTokenSummary
                      key={token.address}
                      token={token}
                      networkId={network?.id || ''}
                      hasBottomSpacing={i < pendingTokens.length - 1}
                    />
                  )
                })}
              </ScrollableWrapper>
            </View>
          )}
        </View>
      )}
      {!!hasSimulationError && (
        <View>
          <Alert type="error" title={simulationErrorMsg} />
        </View>
      )}
      {simulationView === 'no-changes' && (
        <View>
          <Alert
            type="info"
            isTypeLabelHidden
            title={
              <Trans>
                No token balance changes detected. Please{' '}
                <Text appearance="infoText" weight="semiBold">
                  carefully
                </Text>{' '}
                review the transaction preview below.
              </Trans>
            }
          />
        </View>
      )}
      {shouldShowLoader && <SimulationSkeleton />}
    </View>
  )
}

export default React.memo(Simulation)
