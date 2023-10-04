import React, { useMemo } from 'react'
import { TouchableOpacity, View } from 'react-native'

// import accountPresets from '@ambire-common/constants/accountPresets'
import { isKnownTokenOrContract, isValidAddress } from '@ambire-common/services/address'
import AddIcon from '@common/assets/svg/AddIcon'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
// import useAddressBook from '@common/hooks/useAddressBook'
import useConstants from '@common/hooks/useConstants'

import styles from './styles'

type Props = {
  onAddToAddressBook: () => any
  addressConfirmed: boolean
  setAddressConfirmed: (addressConfirmed: boolean) => any
  uDAddress: string
  ensAddress: string
  address: string
}

// @TODO: implement isKnownAddress
const isKnownAddress = (address: string) => false

const ConfirmAddress = ({
  onAddToAddressBook,
  addressConfirmed,
  setAddressConfirmed,
  uDAddress,
  ensAddress,
  address
}: Props) => {
  const { t } = useTranslation()
  // const { isKnownAddress } = useAddressBook()
  const { constants } = useConstants()

  const unknownWarning = useMemo(() => {
    if (uDAddress || ensAddress) {
      return !isKnownAddress(address)
    }
    return isValidAddress(address) && !isKnownAddress(address)
  }, [address, uDAddress, ensAddress])

  const smartContractWarning = useMemo(
    () => isKnownTokenOrContract(constants!.humanizerInfo, address),
    [address, constants]
  )

  // @TODO: Removed check:  && address !== accountPresets.feeCollector
  return !smartContractWarning && !!unknownWarning ? (
    <View>
      <Checkbox
        value={addressConfirmed}
        onValueChange={() => setAddressConfirmed(!addressConfirmed)}
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
