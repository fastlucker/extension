import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
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
  // const { isKnownAddress } = useAddressBook()

  return !isRecipientHumanizerKnownTokenOrSmartContract &&
    !!isRecipientAddressUnknown &&
    addressValidationMsg !== 'Invalid address.' ? (
    <View>
      <TouchableOpacity
        onPress={onAddToAddressBook}
        // @TODO: implement address book
        disabled
        style={styles.addToAddressBook}
      >
        <Text fontSize={14} underline>
          {t('+ Add it to the address book')}
        </Text>
      </TouchableOpacity>
      {!!isRecipientAddressUnknown && (
        <Checkbox
          value={isRecipientAddressUnknownAgreed}
          onValueChange={onRecipientAddressUnknownCheckboxClick}
          label={t('Confirm sending to a previously unknown address')}
        />
      )}
    </View>
  ) : null
}

export default ConfirmAddress
