import React from 'react'
import { useTranslation } from 'react-i18next'
import { useModalize } from 'react-native-modalize'

import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import TextWarning from '@common/components/TextWarning'
import Title from '@common/components/Title'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'
import { isWeb } from '@config/env'
import HardwareWalletSelectConnection from '@modules/hardware-wallet/components/HardwareWalletSelectConnection'
import useHardwareWalletActions from '@modules/hardware-wallet/hooks/useHardwareWalletActions'

const AddHardwareWalletSigner = () => {
  const { t } = useTranslation()

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const { addSigner } = useHardwareWalletActions()

  const handleOnSelectDevice = async (device: any) => {
    await addSigner(device)
    closeBottomSheet()
  }

  return (
    <>
      <Title hasBottomSpacing={false} style={[spacings.mbTy, spacings.mtTy, textStyles.center]}>
        {t('Add new hardware wallet signer')}
      </Title>
      <Button
        disabled={isWeb}
        text={isWeb ? t('Add Signer (coming soon)') : t('Add Signer')}
        onPress={openBottomSheet}
        style={spacings.mbLg}
      />
      <BottomSheet
        id="hardware-wallet-signer"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        dynamicInitialHeight={false}
      >
        <HardwareWalletSelectConnection onSelectDevice={handleOnSelectDevice} shouldWrap={false} />
      </BottomSheet>
    </>
  )
}

export default AddHardwareWalletSigner
