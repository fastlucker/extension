import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import useSign from '@common/hooks/useSign'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { POPUP_WIDTH } from '@web/constants/spacings'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import SignAccountOpHardwareWalletSigningModal from '@web/modules/sign-account-op/components/SignAccountOpHardwareWalletSigningModal'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import { getUiType } from '@web/utils/uiType'

type Props = {
  displayedView: 'estimate' | 'track' | 'batch'
  closeEstimationModal: () => void
  estimationModalRef: React.RefObject<any>
}

const { isActionWindow } = getUiType()

const SwapAndBridgeEstimation = ({
  closeEstimationModal,
  displayedView,
  estimationModalRef
}: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { dispatch } = useBackgroundService()
  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const { signAccountOpController, hasProceeded } = useSwapAndBridgeControllerState()

  /**
   * Single click broadcast
   */
  const handleBroadcastAccountOp = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP',
      params: {
        isSwapAndBridge: true
      }
    })
  }, [dispatch])

  const handleUpdateStatus = useCallback(
    (status: SigningStatus) => {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE_STATUS',
        params: {
          status
        }
      })
    },
    [dispatch]
  )
  const updateController = useCallback(
    (params: { signingKeyAddr?: string; signingKeyType?: string }) => {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_SIGN_ACCOUNT_OP_UPDATE',
        params
      })
    },
    [dispatch]
  )

  const {
    isViewOnly,
    hasEstimation,
    signingKeyType,
    feePayerKeyType,
    handleDismissLedgerConnectModal,
    shouldDisplayLedgerConnectModal,
    isChooseSignerShown,
    setIsChooseSignerShown,
    isSignLoading,
    renderedButNotNecessarilyVisibleModal,
    handleChangeSigningKey,
    onSignButtonClick
  } = useSign({
    signAccountOpState: signAccountOpController,
    handleBroadcast: handleBroadcastAccountOp,
    handleUpdate: updateController,
    handleUpdateStatus,
    isOneClickSwap: true
  })

  const isTrackDisplayedInActionWindow = displayedView === 'track' && isActionWindow

  return (
    <>
      <BottomSheet
        id="estimation-modal"
        sheetRef={estimationModalRef}
        backgroundColor="primaryBackground"
        closeBottomSheet={!isTrackDisplayedInActionWindow ? closeEstimationModal : undefined}
        shouldBeClosableOnDrag={!isTrackDisplayedInActionWindow}
        // NOTE: This must be lower than SigningKeySelect's z-index
        customZIndex={5}
        type={isTrackDisplayedInActionWindow ? 'modal' : 'bottom-sheet'}
        // Open the bottomSheet automatically when the screen is opened
        // in an action window
        adjustToContentHeight={!isTrackDisplayedInActionWindow}
        autoOpen={hasProceeded || (isActionWindow && !!signAccountOpController)}
        style={
          isTrackDisplayedInActionWindow
            ? { minHeight: 600, ...flexbox.alignCenter, ...flexbox.justifyCenter }
            : {}
        }
        containerInnerWrapperStyles={
          isTrackDisplayedInActionWindow ? { ...flexbox.flex1, width: POPUP_WIDTH } : undefined
        }
        isScrollEnabled={false}
      >
        {!!signAccountOpController && (
          <View>
            <SigningKeySelect
              isVisible={isChooseSignerShown}
              isSigning={isSignLoading || !signAccountOpController.readyToSign}
              handleClose={() => setIsChooseSignerShown(false)}
              selectedAccountKeyStoreKeys={signAccountOpController.accountKeyStoreKeys}
              handleChooseSigningKey={handleChangeSigningKey}
              account={signAccountOpController.account}
            />
            <Estimation
              updateType="Swap&Bridge"
              signAccountOpState={signAccountOpController}
              disabled={signAccountOpController.status?.type !== SigningStatus.ReadyToSign}
              hasEstimation={!!hasEstimation}
              // TODO<oneClickSwap>
              slowRequest={false}
              // TODO<oneClickSwap>
              isViewOnly={isViewOnly}
              isSponsored={false}
              sponsor={undefined}
            />
            <View
              style={{
                height: 1,
                backgroundColor: theme.secondaryBorder,
                ...spacings.mvLg
              }}
            />
            <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
              <Button
                testID="swap-button-back"
                type="secondary"
                text={t('Back')}
                onPress={closeEstimationModal}
                hasBottomSpacing={false}
                disabled={isSignLoading}
                style={{ width: 98 }}
              />
              <Button
                text={t('Sign')}
                hasBottomSpacing={false}
                disabled={isSignLoading}
                onPress={onSignButtonClick}
                style={{ minWidth: 160 }}
              />
            </View>
          </View>
        )}
      </BottomSheet>
      {renderedButNotNecessarilyVisibleModal === 'hw-sign' && signAccountOpController && (
        <SignAccountOpHardwareWalletSigningModal
          signingKeyType={signingKeyType}
          feePayerKeyType={feePayerKeyType}
          broadcastSignedAccountOpStatus={mainCtrlStatuses.broadcastSignedAccountOp}
          signAccountOpStatusType={signAccountOpController.status?.type}
          shouldSignAuth={signAccountOpController.shouldSignAuth}
          signedTransactionsCount={signAccountOpController.signedTransactionsCount}
          accountOp={signAccountOpController.accountOp}
        />
      )}

      {renderedButNotNecessarilyVisibleModal === 'ledger-connect' && (
        <LedgerConnectModal
          isVisible={shouldDisplayLedgerConnectModal}
          handleClose={handleDismissLedgerConnectModal}
          displayOptionToAuthorize={false}
        />
      )}
    </>
  )
}

export default SwapAndBridgeEstimation
