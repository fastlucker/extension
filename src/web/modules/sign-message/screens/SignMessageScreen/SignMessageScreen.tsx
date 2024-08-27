/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { SignMessageAction } from '@ambire-common/controllers/actions/actions'
import { Key } from '@ambire-common/interfaces/keystore'
import { PlainTextMessage, TypedMessage } from '@ambire-common/interfaces/userRequest'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import HumanizedVisualization from '@common/components/HumanizedVisualization'
import NoKeysToSignAlert from '@common/components/NoKeysToSignAlert'
import SkeletonLoader from '@common/components/SkeletonLoader'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useAccountsControllerState from '@web/hooks/useAccountsControllerState'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import FallbackVisualization from '@web/modules/sign-message/screens/SignMessageScreen/FallbackVisualization'
import Info from '@web/modules/sign-message/screens/SignMessageScreen/Info'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const SignMessageScreen = () => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const signStatus = signMessageState.statuses.sign
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean | null>(null)
  const keystoreState = useKeystoreControllerState()
  const { accounts, selectedAccount } = useAccountsControllerState()
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()
  const { isLedgerConnected } = useLedger()
  const [didTriggerSigning, setDidTriggerSigning] = useState(false)
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const [shouldShowFallback, setShouldShowFallback] = useState(false)
  const actionState = useActionsControllerState()
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  const signMessageAction = useMemo(() => {
    if (actionState.currentAction?.type !== 'signMessage') return undefined

    return actionState.currentAction as SignMessageAction
  }, [actionState.currentAction])

  const userRequest = useMemo(() => {
    if (!signMessageAction) return undefined
    if (!['typedMessage', 'message'].includes(signMessageAction.userRequest.action.kind))
      return undefined

    return signMessageAction.userRequest
  }, [signMessageAction])

  const selectedAccountFull = useMemo(
    () => accounts.find((acc) => acc.addr === selectedAccount),
    [accounts, selectedAccount]
  )

  const selectedAccountKeyStoreKeys = useMemo(
    () =>
      keystoreState.keys.filter((key) => selectedAccountFull?.associatedKeys.includes(key.addr)),
    [keystoreState.keys, selectedAccountFull?.associatedKeys]
  )

  const network = useMemo(
    () =>
      networks.find((n) => {
        return signMessageState.messageToSign?.content.kind === 'typedMessage' &&
          signMessageState.messageToSign?.content.domain.chainId
          ? n.chainId.toLocaleString() ===
              signMessageState.messageToSign?.content.domain.chainId.toLocaleString()
          : n.id === signMessageState.messageToSign?.networkId
      }),
    [networks, signMessageState.messageToSign]
  )
  const isViewOnly = useMemo(
    () => selectedAccountKeyStoreKeys.length === 0,
    [selectedAccountKeyStoreKeys.length]
  )

  const visualizeHumanized = useMemo(
    () =>
      signMessageState.humanReadable?.fullVisualization &&
      network &&
      signMessageState.messageToSign?.content.kind,
    [network, signMessageState.humanReadable, signMessageState.messageToSign?.content?.kind]
  )

  const isScrollToBottomForced = useMemo(
    () => typeof hasReachedBottom === 'boolean' && !hasReachedBottom && !visualizeHumanized,
    [hasReachedBottom, visualizeHumanized]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShowFallback(true)
    }, 500)
    return () => clearTimeout(timer)
  })

  useEffect(() => {
    if (!userRequest || !signMessageAction) return

    dispatch({
      type: 'MAIN_CONTROLLER_ACTIVITY_INIT',
      params: {
        filters: {
          account: userRequest.meta.accountAddr,
          network: userRequest.meta.networkId
        }
      }
    })

    dispatch({
      type: 'MAIN_CONTROLLER_SIGN_MESSAGE_INIT',
      params: {
        dapp: {
          name: userRequest?.session?.name || '',
          icon: userRequest?.session?.icon || ''
        },
        messageToSign: {
          accountAddr: userRequest.meta.accountAddr,
          networkId: userRequest.meta.networkId,
          content: userRequest.action as PlainTextMessage | TypedMessage,
          fromActionId: signMessageAction.id,
          signature: null
        }
      }
    })
  }, [dispatch, userRequest, signMessageAction])

  useEffect(() => {
    if (!getUiType().isActionWindow) return
    const reset = () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
    window.addEventListener('beforeunload', reset)

    return () => {
      window.removeEventListener('beforeunload', reset)
    }
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
      dispatch({ type: 'MAIN_CONTROLLER_ACTIVITY_RESET' })
    }
  }, [dispatch])

  const handleReject = () => {
    if (!signMessageAction || !userRequest) return

    dispatch({
      type: 'MAIN_CONTROLLER_REJECT_USER_REQUEST',
      params: { err: t('User rejected the request.'), id: userRequest.id }
    })
  }

  const handleSign = useCallback(
    (chosenSigningKeyAddr?: Key['addr'], chosenSigningKeyType?: Key['type']) => {
      // Has more than one key, should first choose the key to sign with
      const hasChosenSigningKey = chosenSigningKeyAddr && chosenSigningKeyType
      if (selectedAccountKeyStoreKeys.length > 1 && !hasChosenSigningKey) {
        return setIsChooseSignerShown(true)
      }

      setDidTriggerSigning(true)
      if (signMessageState.signingKeyType === 'ledger' && !isLedgerConnected) return

      const keyAddr = chosenSigningKeyAddr || selectedAccountKeyStoreKeys[0].addr
      const keyType = chosenSigningKeyType || selectedAccountKeyStoreKeys[0].type

      dispatch({
        type: 'MAIN_CONTROLLER_HANDLE_SIGN_MESSAGE',
        params: { keyAddr, keyType }
      })
    },
    [dispatch, isLedgerConnected, selectedAccountKeyStoreKeys, signMessageState.signingKeyType]
  )

  const resolveButtonText = useMemo(() => {
    if (isScrollToBottomForced && shouldShowFallback) return t('Read the message')

    if (signStatus === 'LOADING') return t('Signing...')

    return t('Sign')
  }, [isScrollToBottomForced, shouldShowFallback, signStatus, t])

  const handleDismissLedgerConnectModal = useCallback(() => {
    setDidTriggerSigning(false)
  }, [])

  // In the split second when the action window opens, but the state is not yet
  // initialized, to prevent a flash of the fallback visualization, show a
  // loading spinner instead (would better be a skeleton, but whatever).
  if (!signMessageState.isInitialized) {
    return (
      <View style={[StyleSheet.absoluteFill, flexbox.center]}>
        <Spinner />
      </View>
    )
  }

  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo />}
      footer={
        <ActionFooter
          onReject={handleReject}
          onResolve={handleSign}
          resolveButtonText={resolveButtonText}
          resolveDisabled={
            signStatus === 'LOADING' ||
            isScrollToBottomForced ||
            isViewOnly ||
            (!visualizeHumanized &&
              !shouldShowFallback &&
              signMessageState.messageToSign?.content.kind === 'typedMessage')
          }
          resolveButtonTestID="button-sign"
        />
      }
    >
      <SigningKeySelect
        isVisible={isChooseSignerShown}
        isSigning={signStatus === 'LOADING'}
        selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
        handleChooseSigningKey={handleSign}
        handleClose={() => setIsChooseSignerShown(false)}
      />
      <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
        <Text weight="medium" fontSize={24} style={[spacings.mbLg]}>
          {t('Sign message')}
        </Text>
        <View style={styles.container}>
          <View style={[styles.leftSideContainer, !maxWidthSize('m') && { flexBasis: '40%' }]}>
            <Info kindOfMessage={signMessageState.messageToSign?.content.kind} />
          </View>
          <View style={[styles.separator, maxWidthSize('xl') ? spacings.mh3Xl : spacings.mhXl]} />
          <View style={flexbox.flex1}>
            <ExpandableCard
              enableExpand={false}
              style={spacings.mbMd}
              hasArrow={false}
              content={
                visualizeHumanized &&
                // @TODO: Duplicate check. For some reason ts throws an error if we don't do this
                signMessageState.humanReadable &&
                signMessageState.messageToSign?.content.kind ? (
                  <HumanizedVisualization
                    data={signMessageState.humanReadable.fullVisualization}
                    networkId={network?.id || 'ethereum'}
                  />
                ) : shouldShowFallback ? (
                  <>
                    <View style={spacings.mrTy}>
                      <ErrorOutlineIcon width={24} height={24} />
                    </View>
                    <Text fontSize={maxWidthSize('xl') ? 16 : 12} appearance="warningText">
                      <Text
                        fontSize={maxWidthSize('xl') ? 16 : 12}
                        appearance="warningText"
                        weight="semiBold"
                      >
                        {t('Warning: ')}
                      </Text>
                      {t('Please read the whole message as we are unable to translate it!')}
                    </Text>
                  </>
                ) : (
                  <SkeletonLoader width="100%" height={25} />
                )
              }
            />
            <FallbackVisualization
              setHasReachedBottom={setHasReachedBottom}
              hasReachedBottom={!!hasReachedBottom}
              messageToSign={signMessageState.messageToSign}
            />
            {isViewOnly && (
              <NoKeysToSignAlert
                style={{
                  width: '100%',
                  ...spacings.mtMd
                }}
                isTransaction={false}
              />
            )}
          </View>
          {signMessageState.signingKeyType && signMessageState.signingKeyType !== 'internal' && (
            <HardwareWalletSigningModal
              keyType={signMessageState.signingKeyType}
              isVisible={signStatus === 'LOADING'}
            />
          )}
          {signMessageState.signingKeyType === 'ledger' && didTriggerSigning && (
            <LedgerConnectModal
              isVisible={!isLedgerConnected}
              handleOnConnect={handleDismissLedgerConnectModal}
              handleClose={handleDismissLedgerConnectModal}
              displayOptionToAuthorize={false}
            />
          )}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SignMessageScreen)
