import { isHexString } from 'ethers'
import React, { FC, useMemo, useState } from 'react'
import { View } from 'react-native'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomNetwork, NetworkPreference } from '@ambire-common/interfaces/settings'
import { calculateTokensPendingState } from '@ambire-common/libs/portfolio/portfolioView'
import Alert from '@common/components/Alert'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import PendingTokenSummary from '@web/modules/sign-account-op/components/PendingTokenSummary'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'

import getStyles from './styles'

interface Props {
  network: (NetworkDescriptor & (NetworkPreference | CustomNetwork)) | undefined
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
      return calculateTokensPendingState(
        signAccountOpState?.accountOp.accountAddr,
        network,
        portfolioState.state
      )
    }
    return []
  }, [network, portfolioState.state, signAccountOpState?.accountOp])

  const portfolioStatePending = useMemo(() => {
    if (!signAccountOpState?.accountOp || !network?.id) return null

    return portfolioState.state.pending[signAccountOpState.accountOp.accountAddr][network!.id]
  }, [network, portfolioState.state.pending, signAccountOpState?.accountOp])

  const pendingSendTokens = useMemo(
    () => pendingTokens.filter((token) => token.type === 'send'),
    [pendingTokens]
  )

  const pendingReceiveTokens = useMemo(
    () => pendingTokens.filter((token) => token.type === 'receive'),
    [pendingTokens]
  )

  // @TODO: Structure this code in a more readable way- helpers, useEffect and useState
  let hasSimulationError = false
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    (!!portfolioStatePending?.errors.find((err) => err.simulationErrorMsg) ||
      !!portfolioStatePending?.criticalError?.simulationErrorMsg ||
      !!signAccountOpState?.errors.length)
  ) {
    hasSimulationError = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  let simulationErrorMsg = 'We were unable to simulate the transaction'
  if (portfolioStatePending?.criticalError) {
    if (isHexString(portfolioStatePending?.criticalError.simulationErrorMsg)) {
      simulationErrorMsg = `${simulationErrorMsg}. Please report this error to our team: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
    } else {
      simulationErrorMsg = `${simulationErrorMsg}: ${portfolioStatePending?.criticalError.simulationErrorMsg}`
    }
  } else {
    const simulationError = portfolioStatePending?.errors.find((err) => err.simulationErrorMsg)
    if (simulationError) {
      if (isHexString(simulationError)) {
        simulationErrorMsg = `${simulationErrorMsg}. Please report this error to our team: ${simulationError.simulationErrorMsg}`
      } else {
        simulationErrorMsg = `${simulationErrorMsg}: ${simulationError.simulationErrorMsg}`
      }
    }
  }

  let shouldShowNoBalanceChanges = false
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    !pendingTokens.length &&
    !portfolioStatePending?.errors.length &&
    !portfolioStatePending?.criticalError &&
    !signAccountOpState?.errors.length
  ) {
    shouldShowNoBalanceChanges = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  let shouldShowSimulation = false
  const isReloading = initialSimulationLoaded && !hasEstimation
  if (
    (!portfolioStatePending?.isLoading || initialSimulationLoaded) &&
    !!pendingTokens.length &&
    !hasSimulationError &&
    !isReloading
  ) {
    shouldShowSimulation = true
    if (!initialSimulationLoaded) setInitialSimulationLoaded(true)
  }

  let shouldShowLoader = false
  if ((!!portfolioStatePending?.isLoading && !initialSimulationLoaded) || isReloading) {
    shouldShowLoader = true
  }
  // End of @TODO

  return (
    <View style={styles.simulationSection}>
      <SectionHeading>{t('Simulation results')}</SectionHeading>
      {!!shouldShowSimulation && (
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
                      networkId={network!.id}
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
                      networkId={network!.id}
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
      {!!shouldShowNoBalanceChanges && (
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
      {shouldShowLoader && (
        <View style={spacings.mt}>
          <Spinner style={styles.spinner} />
        </View>
      )}
    </View>
  )
}

export default Simulation
