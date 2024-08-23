import React, { useMemo } from 'react'

import { MainController } from '@ambire-common/controllers/main/main'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { Key } from '@ambire-common/interfaces/keystore'
import { AccountOp } from '@ambire-common/libs/accountOp/accountOp'
import HardwareWalletSigningModal from '@web/modules/hardware-wallet/components/HardwareWalletSigningModal'

interface Props {
  signingKeyType?: AccountOp['signingKeyType']
  feePayerKeyType?: Key['type']
  broadcastSignedAccountOpStatus: MainController['statuses']['broadcastSignedAccountOp']
  hasWarningToPromptBeforeSign: boolean
  signAccountOpStatusType?: SigningStatus
}

const SignAccountOpHardwareWalletSigningModal: React.FC<Props> = ({
  signingKeyType,
  feePayerKeyType,
  broadcastSignedAccountOpStatus,
  signAccountOpStatusType,
  hasWarningToPromptBeforeSign
}: Props) => {
  const shouldRender = useMemo(() => {
    const isAtLeastOneOfTheKeysInvolvedExternal =
      (!!signingKeyType && signingKeyType !== 'internal') ||
      (!!feePayerKeyType && feePayerKeyType !== 'internal')

    return isAtLeastOneOfTheKeysInvolvedExternal
  }, [signingKeyType, feePayerKeyType])

  const shouldBeVisible = useMemo(() => {
    if (hasWarningToPromptBeforeSign) return false

    const isCurrentlyBroadcastingWithExternalKey =
      broadcastSignedAccountOpStatus === 'LOADING' &&
      !!feePayerKeyType &&
      feePayerKeyType !== 'internal'
    const isCurrentlySigningWithExternalKey =
      signAccountOpStatusType === SigningStatus.InProgress &&
      !!signingKeyType &&
      signingKeyType !== 'internal'

    return isCurrentlyBroadcastingWithExternalKey || isCurrentlySigningWithExternalKey
  }, [
    broadcastSignedAccountOpStatus,
    feePayerKeyType,
    hasWarningToPromptBeforeSign,
    signAccountOpStatusType,
    signingKeyType
  ])

  const currentlyInvolvedSignOrBroadcastKeyType = useMemo(
    () => (signAccountOpStatusType === SigningStatus.InProgress ? signingKeyType : feePayerKeyType),
    [feePayerKeyType, signAccountOpStatusType, signingKeyType]
  )

  if (!shouldRender || !currentlyInvolvedSignOrBroadcastKeyType) return null

  return (
    <HardwareWalletSigningModal
      isVisible={shouldBeVisible}
      keyType={currentlyInvolvedSignOrBroadcastKeyType}
    />
  )
}

export default React.memo(SignAccountOpHardwareWalletSigningModal)
