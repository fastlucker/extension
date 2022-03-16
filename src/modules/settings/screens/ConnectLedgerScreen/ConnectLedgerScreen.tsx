import React from 'react'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import useBottomSheet from '@modules/common/components/BottomSheet/hooks/useBottomSheet'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const ConnectLedgerScreen = () => {
  const { t } = useTranslation()
  const { sheetRef, isOpen, openBottomSheet, closeBottomSheet } = useBottomSheet()

  return (
    <Wrapper>
      <Title>{t('Via Bluetooth')}</Title>
      <Button onPress={openBottomSheet} text={t('Ledger Nano X 1EJ3')} />

      <Title style={spacings.mt}>{t('Via USB')}</Title>
      <Text>{t('No devices found.')}</Text>

      <BottomSheet
        id="choose-address"
        sheetRef={sheetRef}
        isOpen={isOpen}
        closeBottomSheet={closeBottomSheet}
      >
        <Title>{t('Select a signer account')}</Title>
        <P>
          {t(
            "Signer address is the Ledger address you will use to sign transactions on Ambire Wallet. А new account will be created using this signer if you don't have one."
          )}
        </P>
        <Button text="0xB66767DE2A2FFC520BF0e3B59321Faa0fb0090d7" />
        <Button text="0xb248cb13F0814f116aa4edaF234dbf617418AA13" />
        <Button text="0x92399085722ca1C8b28510a796eb226979cEb0ab" />
      </BottomSheet>
    </Wrapper>
  )
}

export default ConnectLedgerScreen
