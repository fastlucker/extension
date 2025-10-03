import React from 'react'
import { View } from 'react-native'

import { ITransferController } from '@ambire-common/interfaces/transfer'
import Checkbox from '@common/components/Checkbox'
import { useTranslation } from '@common/config/localization'
import spacings from '@common/styles/spacings'

type Props = {
  isRecipientAddressUnknown: boolean
  isRecipientHumanizerKnownTokenOrSmartContract: boolean
  isRecipientAddressUnknownAgreed: ITransferController['isRecipientAddressUnknownAgreed']
  onRecipientCheckboxClick: () => void
  addressValidationMsg: string
  isSWWarningVisible: boolean
  isRecipientAddressSameAsSender: boolean
}

const ConfirmAddress = ({
  onRecipientCheckboxClick,
  isRecipientHumanizerKnownTokenOrSmartContract,
  isRecipientAddressUnknown,
  isRecipientAddressUnknownAgreed,
  addressValidationMsg,
  isSWWarningVisible,
  isRecipientAddressSameAsSender
}: Props) => {
  const { t } = useTranslation()

  return !isRecipientHumanizerKnownTokenOrSmartContract &&
    !!isRecipientAddressUnknown &&
    !isRecipientAddressSameAsSender &&
    addressValidationMsg !== 'Invalid address.' ? (
    <View style={spacings.mb}>
      <Checkbox
        value={isRecipientAddressUnknownAgreed}
        onValueChange={onRecipientCheckboxClick}
        label={
          isSWWarningVisible
            ? t(
                'I confirm sending to this address and that it’s not a CEX (which won’t support ETH deposits from smart wallets).'
              )
            : t('Confirm sending to this address.')
        }
        style={spacings.mb0}
        testID="recipient-address-unknown-checkbox"
      />
    </View>
  ) : null
}

export default ConfirmAddress
