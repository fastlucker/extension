import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { InputProps } from '@common/components/Input'
import spacings from '@common/styles/spacings'
import ConfirmAddress from '@web/modules/transfer/components/ConfirmAddress'

import RecipientInput from '../RecipientInput'
import Text from '../Text'

interface Props extends InputProps {
  setAddress: (text: string) => void
  address: string
  uDAddress: string
  ensAddress: string
  addressValidationMsg: string
  setAddressConfirmed: React.Dispatch<React.SetStateAction<boolean>>
  addressConfirmed: boolean
}

const Recipient: React.FC<Props> = ({
  setAddress,
  address,
  uDAddress,
  ensAddress,
  addressValidationMsg,
  setAddressConfirmed,
  addressConfirmed
}) => {
  const { t } = useTranslation()

  return (
    <>
      <RecipientInput
        containerStyle={spacings.mb}
        isValidUDomain={!!uDAddress}
        isValidEns={!!ensAddress}
        label="Add Recipient"
        isValid={address.length > 1 && !addressValidationMsg && (!!uDAddress || !!ensAddress)}
        error={address.length > 1 && addressValidationMsg}
        value={address}
        onChangeText={setAddress}
      />
      <View style={spacings.mlTy}>
        <Text style={spacings.mbSm} weight="regular" fontSize={14}>
          {t(
            'Please double-check the recipient address, blockchain transactions are not reversible.'
          )}
        </Text>

        <ConfirmAddress
          address={address}
          uDAddress={uDAddress}
          ensAddress={ensAddress}
          addressConfirmed={addressConfirmed}
          setAddressConfirmed={setAddressConfirmed}
          onAddToAddressBook={() => {}}
        />
      </View>
    </>
  )
}

export default React.memo(Recipient)
