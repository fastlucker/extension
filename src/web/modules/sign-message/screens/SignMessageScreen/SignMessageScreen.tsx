/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { SignMessageAction } from '@ambire-common/controllers/actions/actions'
import { Key } from '@ambire-common/interfaces/keystore'
import { PlainTextMessage, TypedMessage } from '@ambire-common/interfaces/userRequest'
import { humanizeMessage } from '@ambire-common/libs/humanizer'
import NoKeysToSignAlert from '@common/components/NoKeysToSignAlert'
import Spinner from '@common/components/Spinner'
import useTheme from '@common/hooks/useTheme'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'

import Authorization7702 from './Contents/authorization7702'
import Main from './Contents/main'
import getStyles from './styles'

const SignMessageScreen = () => {
  const { t } = useTranslation()
  const signMessageState = useSignMessageControllerState()
  const signStatus = signMessageState.statuses.sign
  const [hasReachedBottom, setHasReachedBottom] = useState<boolean | null>(null)
  const keystoreState = useKeystoreControllerState()
  const { account } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()
  const { isLedgerConnected } = useLedger()
  const [isChooseSignerShown, setIsChooseSignerShown] = useState(false)
  const [shouldDisplayLedgerConnectModal, setShouldDisplayLedgerConnectModal] = useState(false)
  const [isAuthorization, setIsAuthorization] = useState(false)
  const [makeItSmartConfirmed, setMakeItSmartConfirmed] = useState(false)
  const actionState = useActionsControllerState()
  const { styles } = useTheme(getStyles)

  const signMessageAction = useMemo(() => {
    if (actionState.currentAction?.type !== 'signMessage') return undefined

    return actionState.currentAction as SignMessageAction
  }, [actionState.currentAction])

  const userRequest = useMemo(() => {
    if (!signMessageAction) return undefined
    if (
      !['typedMessage', 'message', 'authorization-7702'].includes(
        signMessageAction.userRequest.action.kind
      )
    )
      return undefined

    return signMessageAction.userRequest
  }, [signMessageAction])

  useEffect(() => {
    if (!signMessageAction) return undefined
    if (signMessageAction.userRequest.action.kind !== 'authorization-7702') return

    setIsAuthorization(true)
  }, [signMessageAction])

  const selectedAccountKeyStoreKeys = useMemo(
    () => keystoreState.keys.filter((key) => account?.associatedKeys.includes(key.addr)),
    [keystoreState.keys, account?.associatedKeys]
  )

  const network = useMemo(
    () =>
      networks.find((n) => {
        return signMessageState.messageToSign?.content.kind === 'typedMessage' &&
          signMessageState.messageToSign?.content.domain.chainId
          ? n.chainId.toString() === signMessageState.messageToSign?.content.domain.chainId
          : n.id === signMessageState.messageToSign?.networkId
      }),
    [networks, signMessageState.messageToSign]
  )
  const isViewOnly = useMemo(
    () => selectedAccountKeyStoreKeys.length === 0,
    [selectedAccountKeyStoreKeys.length]
  )
  const humanizedMessage = useMemo(() => {
    if (!signMessageState?.messageToSign) return
    return humanizeMessage(signMessageState.messageToSign)
  }, [signMessageState])

  const visualizeHumanized = useMemo(
    () =>
      humanizedMessage?.fullVisualization &&
      network &&
      signMessageState.messageToSign?.content.kind,
    [network, humanizedMessage, signMessageState.messageToSign?.content?.kind]
  )

  const isScrollToBottomForced = useMemo(
    () => typeof hasReachedBottom === 'boolean' && !hasReachedBottom && !visualizeHumanized,
    [hasReachedBottom, visualizeHumanized]
  )

  useEffect(() => {
    if (!userRequest || !signMessageAction) return

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
    return () => {
      dispatch({ type: 'MAIN_CONTROLLER_SIGN_MESSAGE_RESET' })
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
      if (isAuthorization && !makeItSmartConfirmed) {
        setMakeItSmartConfirmed(true)
        return
      }

      // Has more than one key, should first choose the key to sign with
      const hasChosenSigningKey = chosenSigningKeyAddr && chosenSigningKeyType
      const hasMultipleKeys = selectedAccountKeyStoreKeys.length > 1
      if (hasMultipleKeys && !hasChosenSigningKey) {
        return setIsChooseSignerShown(true)
      }

      const isLedgerKeyChosen = hasMultipleKeys
        ? // Accounts with multiple keys have an additional step to choose the key first
          chosenSigningKeyType === 'ledger'
        : // Take the key type from the account key itself, no additional step to choose key
          selectedAccountKeyStoreKeys[0].type === 'ledger'
      if (isLedgerKeyChosen && !isLedgerConnected) {
        setShouldDisplayLedgerConnectModal(true)
        return
      }

      const keyAddr = chosenSigningKeyAddr || selectedAccountKeyStoreKeys[0].addr
      const keyType = chosenSigningKeyType || selectedAccountKeyStoreKeys[0].type

      dispatch({
        type: 'MAIN_CONTROLLER_HANDLE_SIGN_MESSAGE',
        params: { keyAddr, keyType }
      })
    },
    [
      dispatch,
      isLedgerConnected,
      selectedAccountKeyStoreKeys,
      makeItSmartConfirmed,
      isAuthorization
    ]
  )

  const resolveButtonText = useMemo(() => {
    if (isScrollToBottomForced) return t('Read the message')

    if (signStatus === 'LOADING') return t('Signing...')

    if (isAuthorization && !makeItSmartConfirmed) return 'Make it Smart'

    return t('Sign')
  }, [isScrollToBottomForced, signStatus, t, isAuthorization, makeItSmartConfirmed])

  const rejectButtonText = useMemo(() => {
    if (isAuthorization) return 'Stay Basic'
    return 'Reject'
  }, [isAuthorization])

  const handleDismissLedgerConnectModal = useCallback(() => {
    setShouldDisplayLedgerConnectModal(false)
  }, [])

  // In the split second when the action window opens, but the state is not yet
  // initialized, to prevent a flash of the fallback visualization, show a
  // loading spinner instead (would better be a skeleton, but whatever).
  if (!signMessageState.isInitialized || !account || !signMessageAction) {
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
          resolveDisabled={signStatus === 'LOADING' || isScrollToBottomForced || isViewOnly}
          resolveButtonTestID="button-sign"
          rejectButtonText={rejectButtonText}
        />
      }
    >
      <SigningKeySelect
        isVisible={isChooseSignerShown}
        isSigning={signStatus === 'LOADING'}
        selectedAccountKeyStoreKeys={selectedAccountKeyStoreKeys}
        handleChooseSigningKey={handleSign}
        handleClose={() => setIsChooseSignerShown(false)}
        account={account}
      />
      {isViewOnly && (
        <View style={styles.noKeysToSignAlert}>
          <NoKeysToSignAlert
            style={{
              width: 640
            }}
            isTransaction={false}
          />
        </View>
      )}
      {isAuthorization && !makeItSmartConfirmed ? (
        <Authorization7702 />
      ) : (
        <Main
          shouldDisplayLedgerConnectModal={shouldDisplayLedgerConnectModal}
          isLedgerConnected={isLedgerConnected}
          handleDismissLedgerConnectModal={handleDismissLedgerConnectModal}
          hasReachedBottom={hasReachedBottom}
          setHasReachedBottom={setHasReachedBottom}
        />
      )}
    </TabLayoutContainer>
  )
}

export default React.memo(SignMessageScreen)
