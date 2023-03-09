import accountPresets from 'ambire-common/src/constants/accountPresets'
import { isKnownTokenOrContract, isValidAddress } from 'ambire-common/src/services/address'
import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

import AddIcon from '@assets/svg/AddIcon'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useAddressBook from '@common/hooks/useAddressBook'
import useConstants from '@common/hooks/useConstants'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'

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
  const { constants } = useConstants()

  const unknownWarning = useMemo(() => {
    if (uDAddress || ensAddress) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, ensAddress, isKnownAddress])

  const smartContractWarning = useMemo(
    () => isKnownTokenOrContract(constants!.humanizerInfo, address),
    [address, constants]
  )

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
