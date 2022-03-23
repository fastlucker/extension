import React from 'react'
import { useTranslation } from 'react-i18next'

import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Title from '@modules/common/components/Title'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@modules/hardware-wallet/hooks/useHardwareWalletActions'
import { ledgerGetAddress } from '@modules/hardware-wallet/services/ledger'

const AddHardwareWalletSigner = () => {
  const { t } = useTranslation()
  const { sheetRef, openBottomSheet, closeBottomSheet, isOpen } = useBottomSheet()
  const { addSigner } = useHardwareWalletActions()

  const handleOnSelectDevice = async (device: any) => {
    closeBottomSheet()

    const address = await ledgerGetAddress(device)
    addSigner(address)
  }

  return (
    <>
      <Title>{t('Add new hardware wallet signer')}</Title>
      <Button text={t('Add signer')} onPress={openBottomSheet} />
      <P>{t('For accessing the full signers management options, please visit the web app.')}</P>
      <BottomSheet
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <HardwareWalletSelectConnection onSelectDevice={handleOnSelectDevice} shouldWrap={false} />
      </BottomSheet>
    </>
  )
}

export default AddHardwareWalletSigner
