import accountPresets from 'ambire-common/src/constants/accountPresets'
import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import AddIcon from '@assets/svg/AddIcon'
import { useTranslation } from '@config/localization'
import Checkbox from '@modules/common/components/Checkbox'
import Text from '@modules/common/components/Text'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

type Props = {
  onAddToAddressBook: () => any
  addressConfirmed: boolean
  setAddressConfirmed: (addressConfirmed: boolean) => any
  uDAddress: string
  ensAddress: string
  address: string
}

const ConfirmAddress = ({
  onAddToAddressBook,
  addressConfirmed,
  setAddressConfirmed,
  uDAddress,
  ensAddress,
  address
}: Props) => {
  const { t } = useTranslation()
  const { isKnownAddress } = useAddressBook()

  const unknownWarning = useMemo(() => {
    if (uDAddress || ensAddress) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, ensAddress, isKnownAddress])

  const smartContractWarning = useMemo(() => isKnownTokenOrContract(address), [address])

  return !smartContractWarning && !!unknownWarning && address !== accountPresets.feeCollector ? (
    <>
      <Checkbox
        value={addressConfirmed}
        onValueChange={() => setAddressConfirmed(!addressConfirmed)}
        label={t('Confirm sending to a previously unknown address')}
      />
      <TouchableOpacity
        onPress={onAddToAddressBook}
        style={[flexboxStyles.directionRow, spacings.mb]}
      >
        <View style={spacings.mrMi}>
          <AddIcon />
        </View>
        <Text underline>{t('Add it to the address book')}</Text>
      </TouchableOpacity>
    </>
  ) : null
}

export default ConfirmAddress
