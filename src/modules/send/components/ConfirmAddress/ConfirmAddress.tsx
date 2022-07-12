import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import AddIcon from '@assets/svg/AddIcon'
import { useTranslation } from '@config/localization'
import Checkbox from '@modules/common/components/Checkbox'
import Text from '@modules/common/components/Text'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

type Props = {
  onAddToAddressBook: () => any
  addressConfirmed: boolean
  setAddressConfirmed: (addressConfirmed: boolean) => any
}

const ConfirmAddress = ({ onAddToAddressBook, addressConfirmed, setAddressConfirmed }: Props) => {
  const { t } = useTranslation()

  return (
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
  )
}

export default ConfirmAddress
