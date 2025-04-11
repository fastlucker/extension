import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import LedgerLetterIcon from '@common/assets/svg/LedgerLetterIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useLedger from '@web/modules/hardware-wallet/hooks/useLedger'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import { getIsSignLoading } from '@web/modules/sign-account-op/utils/helpers'

import TrackProgress from './TrackProgress'

type Props = {
  closeEstimationModal: () => void
  estimationModalRef: React.RefObject<any>
}

const SwapAndBridgeEstimation = ({ closeEstimationModal, estimationModalRef }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { dispatch } = useBackgroundService()
  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const { signAccountOpController } = useSwapAndBridgeControllerState()
  const { isLedgerConnected } = useLedger()
  const [showConnectLedger, setShowConnectLedger] = useState(false)
  const [hasBroadcasted, setHasBroadcasted] = useState(false)

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

  useEffect(() => {
    if (signAccountOpController?.accountOp.signingKeyType !== 'ledger') return
    if (isLedgerConnected) setShowConnectLedger(false)
  }, [signAccountOpController?.accountOp.signingKeyType, isLedgerConnected])

  /**
   * Single click broadcast
   *
   * Before the actual broadcast, some condtions have to be met:
   * - If signing device is ledger, ledger needs to be connected
   */
  const handleBroadcastAccountOp = useCallback(() => {
    if (signAccountOpController?.accountOp.signingKeyType === 'ledger' && !isLedgerConnected) {
      setShowConnectLedger(true)
      return
    }

    dispatch({
      type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP',
      params: {
        isSwapAndBridge: true
      }
    })
  }, [dispatch, isLedgerConnected, signAccountOpController?.accountOp.signingKeyType])

  useEffect(() => {
    const broadcastStatus = mainCtrlStatuses.broadcastSignedAccountOp

    // Note: This may not be the best implementation.
    // Also, there seems to be a bug that causes the bottom sheet to hide
    // and only the backdrop to remain
    if (broadcastStatus === 'SUCCESS') {
      setHasBroadcasted(true)
    }
  }, [mainCtrlStatuses.broadcastSignedAccountOp])

  return (
    <BottomSheet
      id="estimation-modal"
      sheetRef={estimationModalRef}
      backgroundColor="primaryBackground"
      closeBottomSheet={closeEstimationModal}
    >
      {signAccountOpController && !hasBroadcasted && (
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
          {showConnectLedger && (
            <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pvMd]}>
              <LedgerLetterIcon width={16} height={16} />
              <Text style={[spacings.mrTy, spacings.mlTy]}>
                {t('Please connect your Ledger device')}
              </Text>
              <Spinner style={{ width: 16, height: 16 }} />
            </View>
          )}
          {!showConnectLedger && (
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
                onPress={handleBroadcastAccountOp}
                style={{ minWidth: 160 }}
              />
            </View>
          )}
        </View>
      )}
      {(hasBroadcasted ||
        (!signAccountOpController && mainCtrlStatuses.broadcastSignedAccountOp !== 'INITIAL')) && (
        <TrackProgress
          handleClose={() => {
            setHasBroadcasted(false)
            closeEstimationModal()
          }}
        />
      )}
    </BottomSheet>
  )
}

export default SwapAndBridgeEstimation
