import { isHexString } from 'ethers'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { Network } from '@ambire-common/interfaces/network'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import Alert from '@common/components/Alert'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import Text from '@common/components/Text'
import Nft from '@common/components/TokenOrNft/components/Nft'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import PendingTokenSummary from '@web/modules/sign-account-op/components/PendingTokenSummary'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'

import SimulationSkeleton from './SimulationSkeleton'
import getStyles from './styles'

interface Props {
  network?: Network
  // marks whether the estimation has been done regardless
  // of whether the estimation returned an error or not
  isEstimationComplete: boolean
}

const Simulation: FC<Props> = ({ network, isEstimationComplete }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const signAccountOpState = useSignAccountOpControllerState()
  const {
    portfolio: { tokens, collections, pending }
  } = useSelectedAccountControllerState()
  const [initialSimulationLoaded, setInitialSimulationLoaded] = useState(false)
  const { networks } = useNetworksControllerState()

  const pendingTokens = useMemo(() => {
    if (signAccountOpState?.accountOp && network) {
      const pendingData = pending[network.id]

      if (!pendingData || !pendingData.isReady || !pendingData.result) return []

      return tokens.filter((token) => token.networkId === network.id && !!token.simulationAmount)
    }
    return []
  }, [network, pending, signAccountOpState?.accountOp, tokens])

  const portfolioStatePending = useMemo(() => {
    if (!signAccountOpState?.accountOp || !network?.id) return null

    return pending[network.id]
  }, [network?.id, pending, signAccountOpState?.accountOp])

  const pendingSendTokens = useMemo(
    () => pendingTokens.filter((token) => token.simulationAmount! < 0),
    [pendingTokens]
  )
  const pendingSendCollection = useMemo(() => {
    if (signAccountOpState?.accountOp?.accountAddr && network?.id)
      return (
        collections?.filter(
          (i) => i.postSimulation?.sending && i.postSimulation.sending.length > 0
        ) || []
      )
    return []
  }, [collections, network?.id, signAccountOpState?.accountOp?.accountAddr])

  const pendingReceiveCollection = useMemo(() => {
    if (signAccountOpState?.accountOp?.accountAddr && network?.id)
      return (
        collections?.filter(
          (i) => i.postSimulation?.receiving && i.postSimulation.receiving.length > 0
        ) || []
      )
    return []
  }, [signAccountOpState?.accountOp?.accountAddr, network?.id, collections])

  const pendingReceiveTokens = useMemo(
    () => pendingTokens.filter((token) => token.simulationAmount! > 0),
    [pendingTokens]
  )

  const isReloading = useMemo(
    () => initialSimulationLoaded && !isEstimationComplete,
    [isEstimationComplete, initialSimulationLoaded]
  )

  const simulationErrorMsg = useMemo(() => {
    if (portfolioStatePending?.isLoading && !initialSimulationLoaded) return ''

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

  const simulationView:
    | 'no-changes'
    | 'changes'
    | 'error'
    | 'error-handled-elsewhere'
    | 'simulation-not-supported'
    | null = useMemo(() => {
    if (shouldShowLoader || !signAccountOpState?.isInitialized) return null

    if (signAccountOpState.status?.type === SigningStatus.EstimationError)
      return 'error-handled-elsewhere'

    if (simulationErrorMsg) return 'error'

    if (pendingSendCollection.length || pendingReceiveCollection.length || pendingTokens.length)
      return 'changes'

    // no-changes from here
    if (!isSmartAccount(signAccountOpState.account) && !!network?.rpcNoStateOverride)
      return 'simulation-not-supported'

    return 'no-changes'
  }, [
    shouldShowLoader,
    signAccountOpState?.isInitialized,
    signAccountOpState?.status,
    simulationErrorMsg,
    pendingSendCollection.length,
    pendingReceiveCollection.length,
    pendingTokens.length,
    network?.rpcNoStateOverride,
    signAccountOpState?.account
  ])

  useEffect(() => {
    if (simulationView && !initialSimulationLoaded) {
      setInitialSimulationLoaded(true)
    }
  }, [initialSimulationLoaded, simulationView])

  return (
    <View style={styles.simulationSection}>
      <SectionHeading>{t('Transaction simulation')}</SectionHeading>
      {simulationView === 'changes' && (
        <View style={[flexbox.directionRow, flexbox.flex1]}>
          {(!!pendingSendTokens.length || !!pendingSendCollection.length) && (
            <View
              style={[styles.simulationContainer, !!pendingReceiveTokens.length && spacings.mrTy]}
            >
              <View style={styles.simulationContainerHeader}>
                <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                  {t('Assets out')}
                </Text>
              </View>
              <ScrollableWrapper
                style={styles.simulationScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {pendingSendTokens?.map((token, i) => {
                  return (
                    <PendingTokenSummary
                      key={token.address}
                      token={token}
                      networkId={network?.id || ''}
                      hasBottomSpacing={i < pendingTokens.length - 1}
                    />
                  )
                })}
                {pendingSendCollection
                  .map(({ name, postSimulation, address }) =>
                    postSimulation?.sending?.map((itemId: bigint) => {
                      if (!network) return null

                      return (
                        <Nft
                          key={address + itemId}
                          tokenId={itemId}
                          network={network}
                          networks={networks}
                          address={address}
                          nftInfo={{
                            name
                          }}
                          hideSendNft
                          style={spacings.mbMi}
                        />
                      )
                    })
                  )
                  .flat()}
              </ScrollableWrapper>
            </View>
          )}
          {(!!pendingReceiveTokens.length || !!pendingReceiveCollection.length) && (
            <View style={styles.simulationContainer}>
              <View style={styles.simulationContainerHeader}>
                <Text fontSize={14} appearance="secondaryText" numberOfLines={1}>
                  {t('Assets in')}
                </Text>
              </View>
              <ScrollableWrapper
                style={styles.simulationScrollView}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                {pendingReceiveTokens?.map((token, i) => {
                  return (
                    <PendingTokenSummary
                      key={token.address}
                      token={token}
                      networkId={network?.id || ''}
                      hasBottomSpacing={i < pendingTokens.length - 1}
                    />
                  )
                })}
                {pendingReceiveCollection
                  .map(({ name, postSimulation, address }) =>
                    postSimulation?.receiving?.map((itemId: bigint) => {
                      if (!network) return null

                      return (
                        <Nft
                          key={address + itemId}
                          tokenId={itemId}
                          network={network}
                          networks={networks}
                          address={address}
                          nftInfo={{
                            name
                          }}
                          hideSendNft
                          style={spacings.mbMi}
                        />
                      )
                    })
                  )
                  .flat()}
              </ScrollableWrapper>
            </View>
          )}
        </View>
      )}

      {simulationView === 'error-handled-elsewhere' && (
        <Alert
          type="info"
          title={t('The simulation could not be completed because of the transaction problem.')}
        />
      )}

      {simulationView === 'error' && (
        <Alert
          type="error"
          title={`We were unable to simulate the transaction: ${simulationErrorMsg}`}
        />
      )}
      {simulationView === 'no-changes' && (
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
      )}
      {simulationView === 'simulation-not-supported' && (
        <Alert
          type="warning"
          isTypeLabelHidden
          title={
            <Trans>
              The RPC cannot perform simulations for Basic Accounts. Try changing the RPC from
              Settings. If you wish to proceed regardless, please carefully review the transaction
              preview below.
            </Trans>
          }
        />
      )}
      {shouldShowLoader && <SimulationSkeleton />}
    </View>
  )
}

export default React.memo(Simulation)
