import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTranslation } from '@config/localization'
import Checkbox from '@modules/common/components/Checkbox'
import P from '@modules/common/components/P'

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
      <TouchableOpacity onPress={onAddToAddressBook}>
        <P>{t('➕ Add it to the address book')}</P>
      </TouchableOpacity>
    </>
  )
}

export default ConfirmAddress
