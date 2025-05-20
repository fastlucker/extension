import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import {
  SignAccountOpController,
  SigningStatus
} from '@ambire-common/controllers/signAccountOp/signAccountOp'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useSign from '@common/hooks/useSign'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import LedgerConnectModal from '@web/modules/hardware-wallet/components/LedgerConnectModal'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import SignAccountOpHardwareWalletSigningModal from '@web/modules/sign-account-op/components/SignAccountOpHardwareWalletSigningModal'
import SigningKeySelect from '@web/modules/sign-message/components/SignKeySelect'
import { getUiType } from '@web/utils/uiType'
import { SignAccountOpError } from '@ambire-common/interfaces/signAccountOp'

type Props = {
  closeEstimationModal: () => void
  handleBroadcastAccountOp: () => void
  handleUpdateStatus: (status: SigningStatus) => void
  updateController: (params: { signingKeyAddr?: string; signingKeyType?: string }) => void
  estimationModalRef: React.RefObject<any>
  errors?: SignAccountOpError[]
  signAccountOpController: SignAccountOpController | null
  hasProceeded: boolean
  updateType: 'Swap&Bridge' | 'Transfer&TopUp'
}

const { isActionWindow, isTab } = getUiType()

const OneClickEstimation = ({
  closeEstimationModal,
  handleBroadcastAccountOp,
  handleUpdateStatus,
  updateController,
  estimationModalRef,
  signAccountOpController,
  hasProceeded,
  errors,
  updateType
}: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { statuses: mainCtrlStatuses } = useMainControllerState()

  const signingErrors = useMemo(() => {
    const signAccountOpErrors = signAccountOpController ? signAccountOpController.errors : []
    return [...(errors || []), ...signAccountOpErrors]
  }, [errors, signAccountOpController])

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
    onSignButtonClick,
    isSignDisabled
  } = useSign({
    signAccountOpState: signAccountOpController,
    handleBroadcast: handleBroadcastAccountOp,
    handleUpdate: updateController,
    handleUpdateStatus,
    isOneClickSwap: true
  })

  return (
    <>
      <BottomSheet
        id="estimation-modal"
        sheetRef={estimationModalRef}
        type={isTab ? 'modal' : 'bottom-sheet'}
        backgroundColor="primaryBackground"
        // NOTE: This must be lower than SigningKeySelect's z-index
        customZIndex={5}
        autoOpen={hasProceeded || (isActionWindow && !!signAccountOpController)}
        isScrollEnabled={false}
        shouldBeClosableOnDrag={false}
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
              updateType={updateType}
              signAccountOpState={signAccountOpController}
              disabled={signAccountOpController.status?.type !== SigningStatus.ReadyToSign}
              hasEstimation={!!hasEstimation}
              // TODO<oneClickSwap>
              slowRequest={false}
              // TODO<oneClickSwap>
              isViewOnly={isViewOnly}
              isSponsored={signAccountOpController ? signAccountOpController.isSponsored : false}
              sponsor={signAccountOpController ? signAccountOpController.sponsor : undefined}
            />
            {signingErrors.length > 0 && (
              <View style={[flexbox.directionRow, flexbox.alignEnd, spacings.mt]}>
                <Text fontSize={12} appearance="errorText">
                  {t(signingErrors[0].title)}
                </Text>
              </View>
            )}
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
                disabled={isSignDisabled || signingErrors.length > 0}
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
          signAndBroadcastAccountOpStatus={mainCtrlStatuses.signAndBroadcastAccountOp}
          signAccountOpStatusType={signAccountOpController.status?.type}
          shouldSignAuth={signAccountOpController.shouldSignAuth}
          signedTransactionsCount={signAccountOpController.signedTransactionsCount}
          accountOp={signAccountOpController.accountOp}
          actionType={updateType === 'Swap&Bridge' ? 'swapAndBridge' : 'transfer'}
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

export default OneClickEstimation
