import React from 'react'
import { useTranslation } from 'react-i18next'
import { useModalize } from 'react-native-modalize'

import { isWeb } from '@config/env'
import BottomSheet from '@modules/common/components/BottomSheet'
import Button from '@modules/common/components/Button'
import TextWarning from '@modules/common/components/TextWarning'
import Title from '@modules/common/components/Title'
import spacings from '@modules/common/styles/spacings'
import textStyles from '@modules/common/styles/utils/text'
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
      <TextWarning appearance="info">
        {t('For accessing the full signers management options, please visit the web app.')}
      </TextWarning>
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
