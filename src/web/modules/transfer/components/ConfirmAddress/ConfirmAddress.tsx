import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import AddIcon from '@common/assets/svg/AddIcon'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'

import styles from './styles'

type Props = {
  onAddToAddressBook: () => any
  isRecipientSmartContract: boolean
  isRecipientAddressUnknown: boolean
  isRecipientAddressUnknownAgreed: boolean
  onRecipientAddressUnknownCheckboxClick: () => void
  addressValidationMsg: string
}

const ConfirmAddress = ({
  onAddToAddressBook,
  onRecipientAddressUnknownCheckboxClick,
  isRecipientSmartContract,
  isRecipientAddressUnknown,
  isRecipientAddressUnknownAgreed,
  addressValidationMsg
}: Props) => {
  const { t } = useTranslation()
  // const { isKnownAddress } = useAddressBook()

  // @TODO: Removed check:  && address !== accountPresets.feeCollector
  return !isRecipientSmartContract &&
    !!isRecipientAddressUnknown &&
    addressValidationMsg !== 'Invalid address.' ? (
    <View>
      <Checkbox
        value={isRecipientAddressUnknownAgreed}
        onValueChange={onRecipientAddressUnknownCheckboxClick}
        label={t('Confirm sending to a previously unknown address')}
      />
      <TouchableOpacity
        onPress={onAddToAddressBook}
        // @TODO: implement address book
        disabled
        style={styles.addToAddressBook}
      >
        <View style={styles.addToAddressBookIcon}>
          <AddIcon />
        </View>
        <Text fontSize={14} underline>
          {t('Add it to the address book')}
        </Text>
      </TouchableOpacity>
    </View>
  ) : null
}

export default ConfirmAddress
