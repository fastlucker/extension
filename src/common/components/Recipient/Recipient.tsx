import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { TransferControllerState } from '@ambire-common/interfaces/transfer'
import { InputProps } from '@common/components/Input'
import ConfirmAddress from '@web/modules/transfer/components/ConfirmAddress'

import AddressInput from '../AddressInput'
import { AddressValidation } from '../AddressInput/AddressInput'
import Text from '../Text'
import styles from './styles'

interface Props extends InputProps {
  setAddress: (text: string) => void
  address: string
  uDAddress: string
  ensAddress: string
  addressValidationMsg: string
  isRecipientHumanizerKnownTokenOrSmartContract: TransferControllerState['isRecipientHumanizerKnownTokenOrSmartContract']
  isRecipientAddressUnknown: TransferControllerState['isRecipientAddressUnknown']
  isRecipientAddressUnknownAgreed: TransferControllerState['isRecipientAddressUnknownAgreed']
  onRecipientAddressUnknownCheckboxClick: () => void
  validation: AddressValidation
  isRecipientDomainResolving: boolean
}

const Recipient: React.FC<Props> = ({
  setAddress,
  address,
  uDAddress,
  ensAddress,
  addressValidationMsg,
  isRecipientAddressUnknownAgreed,
  onRecipientAddressUnknownCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  validation,
  isRecipientDomainResolving
}) => {
  const { t } = useTranslation()

  return (
    <>
      <AddressInput
        testID='recepient-address-field'
        validation={validation}
        containerStyle={styles.inputContainer}
        udAddress={uDAddress}
        ensAddress={ensAddress}
        isRecipientDomainResolving={isRecipientDomainResolving}
        label="Add Recipient"
        value={address}
        onChangeText={setAddress}
      />
      <View style={styles.inputBottom}>
        <Text style={styles.doubleCheckMessage} weight="regular" fontSize={14}>
          {t(
            'Please double-check the recipient address, blockchain transactions are not reversible.'
          )}
        </Text>

        <ConfirmAddress
          onRecipientAddressUnknownCheckboxClick={onRecipientAddressUnknownCheckboxClick}
          isRecipientHumanizerKnownTokenOrSmartContract={
            isRecipientHumanizerKnownTokenOrSmartContract
          }
          isRecipientAddressUnknown={isRecipientAddressUnknown}
          isRecipientAddressUnknownAgreed={isRecipientAddressUnknownAgreed}
          addressValidationMsg={addressValidationMsg}
          // @TODO: Address book
          onAddToAddressBook={() => {}}
        />
      </View>
    </>
  )
}

export default React.memo(Recipient)
