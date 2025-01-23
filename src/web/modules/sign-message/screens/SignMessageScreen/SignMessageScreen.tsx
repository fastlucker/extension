/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { SignMessageAction } from '@ambire-common/controllers/actions/actions'
import { Key } from '@ambire-common/interfaces/keystore'
import { PlainTextMessage, TypedMessage } from '@ambire-common/interfaces/userRequest'
import { humanizeMessage } from '@ambire-common/libs/humanizer'
import ErrorOutlineIcon from '@common/assets/svg/ErrorOutlineIcon'
import ExpandableCard from '@common/components/ExpandableCard'
import HumanizedVisualization from '@common/components/HumanizedVisualization'
import NetworkBadge from '@common/components/NetworkBadge'
import NoKeysToSignAlert from '@common/components/NoKeysToSignAlert'
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
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSignMessageControllerState from '@web/hooks/useSignMessageControllerState'
import ActionFooter from '@web/modules/action-requests/components/ActionFooter'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import FallbackVisualization from '@web/modules/sign-message/screens/SignMessageScreen/FallbackVisualization'
import Info from '@web/modules/sign-message/screens/SignMessageScreen/Info'

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
  const actionState = useActionsControllerState()
  const { styles, theme } = useTheme(getStyles)
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
      // Has more than one key, should first choose the key to sign with
      const hasChosenSigningKey = chosenSigningKeyAddr && chosenSigningKeyType
      if (selectedAccountKeyStoreKeys.length > 1 && !hasChosenSigningKey) {
        return setIsChooseSignerShown(true)
      }

      if (chosenSigningKeyType === 'ledger' && !isLedgerConnected) {
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
    [dispatch, isLedgerConnected, selectedAccountKeyStoreKeys]
  )

  const resolveButtonText = useMemo(() => {
    if (isScrollToBottomForced) return t('Read the message')

    if (signStatus === 'LOADING') return t('Signing...')

    return t('Sign')
  }, [isScrollToBottomForced, signStatus, t])

  const handleDismissLedgerConnectModal = useCallback(() => {
    setShouldDisplayLedgerConnectModal(false)
  }, [])

  // In the split second when the action window opens, but the state is not yet
  // initialized, to prevent a flash of the fallback visualization, show a
  // loading spinner instead (would better be a skeleton, but whatever).
  if (!signMessageState.isInitialized || !account) {
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
      <TabLayoutWrapperMainContent style={spacings.mbLg} contentContainerStyle={spacings.pvXl}>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.justifySpaceBetween,
            spacings.mbLg
          ]}
        >
          <View style={[flexbox.directionRow, flexbox.alignCenter]}>
            <Text weight="medium" fontSize={24} style={[spacings.mrSm]}>
              {t('Sign message')}
            </Text>
            <NetworkBadge
              style={{ borderRadius: 25, ...spacings.pv0 }}
              networkId={signMessageState.messageToSign?.networkId}
              withOnPrefix
            />
          </View>
          {/* @TODO: Replace with Badge; add size prop to badge; add tooltip  */}
          <View style={styles.kindOfMessage}>
            <Text fontSize={12} color={theme.infoText} numberOfLines={1}>
              {t(
                signMessageState.messageToSign?.content.kind === 'typedMessage'
                  ? 'EIP-712'
                  : 'Standard'
              )}{' '}
              {t('Type')}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={[styles.leftSideContainer, !maxWidthSize('m') && { flexBasis: '40%' }]}>
            <Info />
          </View>
          <View style={[styles.separator, maxWidthSize('xl') ? spacings.mh3Xl : spacings.mhXl]} />
          <View style={flexbox.flex1}>
            <ExpandableCard
              enableExpand={false}
              style={spacings.mbTy}
              hasArrow={false}
              content={
                visualizeHumanized &&
                // @TODO: Duplicate check. For some reason ts throws an error if we don't do this
                humanizedMessage?.fullVisualization &&
                signMessageState.messageToSign?.content.kind ? (
                  <HumanizedVisualization
                    data={humanizedMessage.fullVisualization}
                    networkId={network?.id || 'ethereum'}
                  />
                ) : (
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
                )
              }
            />
            <FallbackVisualization
              setHasReachedBottom={setHasReachedBottom}
              hasReachedBottom={!!hasReachedBottom}
              messageToSign={signMessageState.messageToSign}
            />
          </View>
          {signMessageState.signingKeyType && signMessageState.signingKeyType !== 'internal' && (
            <HardwareWalletSigningModal
              keyType={signMessageState.signingKeyType}
              isVisible={signStatus === 'LOADING'}
            />
          )}
          {shouldDisplayLedgerConnectModal && (
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
