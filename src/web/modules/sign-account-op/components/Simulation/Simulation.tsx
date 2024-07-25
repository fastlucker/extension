import { isHexString } from 'ethers'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import Alert from '@common/components/Alert'
import NetworkBadge from '@common/components/NetworkBadge'
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

  const simulationErrorMsg = useMemo(() => {
    if (portfolioStatePending?.isLoading || !initialSimulationLoaded) return ''

    if (portfolioStatePending?.criticalError) {
      if (isHexString(portfolioStatePending?.criticalError.simulationErrorMsg)) {
        return `Please report this error to our team: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
      }

      return portfolioStatePending?.criticalError.simulationErrorMsg
    }

    const simulationError = portfolioStatePending?.errors.find((err) => err.simulationErrorMsg)
    if (simulationError) {
      if (isHexString(simulationError)) {
        return `Please report this error to our team: ${simulationError.simulationErrorMsg}`
      }
      return simulationError.simulationErrorMsg
    }

    return ''
  }, [
    initialSimulationLoaded,
    portfolioStatePending?.criticalError,
    portfolioStatePending?.errors,
    portfolioStatePending?.isLoading
  ])

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

  const simulationView: 'no-changes' | 'changes' | 'error' | null = useMemo(() => {
    if (shouldShowLoader || !signAccountOpState?.isInitialized) return null

    if (simulationErrorMsg) return 'error'

    return pendingTokens.length ? 'changes' : 'no-changes'
  }, [
    simulationErrorMsg,
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
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbLg
        ]}
      >
        <SectionHeading withMb={false}>{t('Simulation results')}</SectionHeading>
        <NetworkBadge networkId={network?.id} withOnPrefix />
      </View>
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
      {simulationView === 'error' && (
        <View>
          <Alert
            type="error"
            title={`We were unable to simulate the transaction: ${simulationErrorMsg}`}
          />
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
