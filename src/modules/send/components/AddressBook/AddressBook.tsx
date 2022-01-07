import React from 'react'
import { View } from 'react-native'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Text from '@modules/common/components/Text'

import styles from './styles'

interface Props {
  sheetRef: any
}

const AddressBook = ({ sheetRef }: Props) => {
  const { t } = useTranslation()

  return (
    <BottomSheet sheetRef={sheetRef}>
      <View style={styles.addNewAddressContainer}>
        <Text>{t('📰 Address Book')}</Text>
        <Text>➕</Text>
      </View>
    </BottomSheet>
  )
}

export default AddressBook
