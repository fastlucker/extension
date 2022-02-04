import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTranslation } from '@config/localization'
import { FontAwesome } from '@expo/vector-icons'
import Checkbox from '@modules/common/components/Checkbox'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

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
        style={[flexboxStyles.directionRow, spacings.mbSm]}
      >
        <FontAwesome style={spacings.mrMi} name="plus" size={18} color={colors.primaryIconColor} />
        <Text style={[textStyles.bold]}>{t('Add it to the address book')}</Text>
      </TouchableOpacity>
    </>
  )
}

export default ConfirmAddress
