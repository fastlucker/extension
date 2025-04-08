import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import { getIsSignLoading } from '@web/modules/sign-account-op/utils/helpers'

type Props = {
  closeEstimationModal: () => void
  estimationModalRef: React.RefObject<any>
}

const SwapAndBridgeEstimation = ({ closeEstimationModal, estimationModalRef }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const { signAccountOpController } = useSwapAndBridgeControllerState()

  const isViewOnly = useMemo(
    () => signAccountOpController?.accountKeyStoreKeys.length === 0,
    [signAccountOpController?.accountKeyStoreKeys]
  )
  const hasEstimation = useMemo(
    () =>
      signAccountOpController?.isInitialized &&
      !!signAccountOpController?.gasPrices &&
      !signAccountOpController.estimation.error,
    [
      signAccountOpController?.estimation?.error,
      signAccountOpController?.gasPrices,
      signAccountOpController?.isInitialized
    ]
  )

  const isSignLoading = getIsSignLoading(signAccountOpController?.status)

  const handleRejectAccountOp = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_DESTROY_SIGN_ACCOUNT_OP'
    })
    closeEstimationModal()
  }, [closeEstimationModal, dispatch])

  const handleBroadcastAccountOp = useCallback(() => {
    dispatch({
      type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP',
      params: {
        isSwapAndBridge: true
      }
    })
    closeEstimationModal()
  }, [closeEstimationModal, dispatch])

  return (
    <BottomSheet
      id="estimation-modal"
      sheetRef={estimationModalRef}
      backgroundColor="primaryBackground"
      closeBottomSheet={closeEstimationModal}
    >
      {signAccountOpController && (
        <View>
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
              testID="transaction-button-reject"
              type="danger"
              text={t('Reject')}
              onPress={handleRejectAccountOp}
              hasBottomSpacing={false}
              size="large"
              disabled={isSignLoading}
              style={{ width: 98 }}
            />
            <Button
              text={t('Sign')}
              hasBottomSpacing={false}
              disabled={isSignLoading}
              onPress={handleBroadcastAccountOp}
              style={{ minWidth: 160 }}
            />
          </View>
        </View>
      )}
    </BottomSheet>
  )
}

export default SwapAndBridgeEstimation
