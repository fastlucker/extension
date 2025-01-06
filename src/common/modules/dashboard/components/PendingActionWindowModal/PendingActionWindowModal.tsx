import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useModalize } from 'react-native-modalize'

import PendingActionWindowIcon from '@common/assets/svg/PendingActionWindowIcon'
import BottomSheet from '@common/components/BottomSheet'
import DualChoiceModal from '@common/components/DualChoiceModal'
import spacings from '@common/styles/spacings'
import { closeCurrentWindow } from '@web/extension-services/background/webapi/window'
import useActionsControllerState from '@web/hooks/useActionsControllerState'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { getUiType } from '@web/utils/uiType'

const isPopup = getUiType().isPopup

const PendingActionWindowModal = () => {
  const { ref: sheetRef, close: closeBottomSheet } = useModalize()
  const { t } = useTranslation()
  const { dispatch } = useBackgroundService()
  const { actionWindow, currentAction } = useActionsControllerState()
  const onPrimaryButtonPress = useCallback(() => {
    dispatch({ type: 'ACTIONS_CONTROLLER_FOCUS_ACTION_WINDOW' })
    closeCurrentWindow()
  }, [dispatch])

  const title = useMemo(() => {
    if (!currentAction) return t('Pending Action Window')

    if (currentAction.type === 'accountOp') return t('Pending transaction signature window')
    if (currentAction.type === 'signMessage') return t('Pending message signature window')
    if (currentAction.type === 'switchAccount') return t('Pending switch account window')
    if (currentAction.type === 'dappRequest') {
      if (currentAction.userRequest.action.kind === 'dappConnect')
        return t('Pending app connection window')
      if (currentAction.userRequest.action.kind === 'walletAddEthereumChain')
        return t('Adding a network is pending')
      if (currentAction.userRequest.action.kind === 'walletWatchAsset')
        return t('Adding a token is pending')
    }

    return t('Pending Action Window')
  }, [currentAction, t])

  const description = useMemo(() => {
    if (!currentAction)
      return t(
        'You have an opened action window that is minimized. Would you like to focus on the action window?'
      )

    if (currentAction.type === 'accountOp')
      return t(
        'Your transaction(s) are waiting for signature. Would you like to focus on the action window?'
      )
    if (currentAction.type === 'signMessage')
      return t('Message signature is waiting. Would you like to focus on the action window?')
    if (currentAction.type === 'switchAccount')
      return t(
        'You have a pending switch account request. Would you like to focus on the action window?'
      )
    if (currentAction.type === 'dappRequest') {
      if (currentAction.userRequest.action.kind === 'dappConnect')
        return t(
          'Connection request from an app is waiting. Would you like to focus on the action window?'
        )
      if (currentAction.userRequest.action.kind === 'walletAddEthereumChain')
        return t(
          'There is a pending network addition window. Would you like to focus on the action window?'
        )
      if (currentAction.userRequest.action.kind === 'walletWatchAsset')
        return t(
          'There is a pending token addition window. Would you like to focus on the action window?'
        )
    }

    return t(
      'You have an opened action window that is minimized. Would you like to focus on the action window?'
    )
  }, [currentAction, t])

  if (
    isPopup &&
    actionWindow?.id &&
    currentAction &&
    !['benzin', 'unlock'].includes(currentAction.type)
  ) {
    return (
      <BottomSheet
        id="import-seed-phrase"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        backgroundColor="secondaryBackground"
        style={{ overflow: 'hidden', width: 496, ...spacings.ph0, ...spacings.pv0 }}
        type="modal"
        autoOpen
      >
        <DualChoiceModal
          title={title}
          description={description}
          Icon={PendingActionWindowIcon}
          primaryButtonText={t('Focus Window')}
          onPrimaryButtonPress={onPrimaryButtonPress}
          onCloseIconPress={closeBottomSheet}
        />
      </BottomSheet>
    )
  }

  return null
}

export default React.memo(PendingActionWindowModal)
