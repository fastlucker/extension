import React from 'react'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import { useTranslation } from '@common/config/localization'

import styles from './styles'

type Props = {
  onAddToAddressBook: () => any
  isRecipientHumanizerKnownTokenOrSmartContract: TransferControllerState['isRecipientHumanizerKnownTokenOrSmartContract']
  isRecipientAddressUnknown: TransferControllerState['isRecipientAddressUnknown']
  isRecipientAddressUnknownAgreed: TransferControllerState['isRecipientAddressUnknownAgreed']
  onRecipientAddressUnknownCheckboxClick: () => void
  addressValidationMsg: string
}

const ConfirmAddress = ({
  onAddToAddressBook,
  onRecipientAddressUnknownCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  isRecipientAddressUnknownAgreed,
  addressValidationMsg
}: Props) => {
  const { t } = useTranslation()

  return !isRecipientHumanizerKnownTokenOrSmartContract &&
    !!isRecipientAddressUnknown &&
    addressValidationMsg !== 'Invalid address.' ? (
    <>
      <Checkbox
        value={isRecipientAddressUnknownAgreed}
        onValueChange={onRecipientAddressUnknownCheckboxClick}
        label={t('Confirm sending to a previously unknown address')}
      />
      <Button
        style={styles.addToAddressBook}
        text={t('Add to Address Book')}
        onPress={onAddToAddressBook}
      />
    </>
  ) : null
}

export default ConfirmAddress
