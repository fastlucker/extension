import React, { useMemo } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTranslation } from '@config/localization'
import { MaterialIcons } from '@expo/vector-icons'
import Blockies from '@modules/common/components/Blockies'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

type Props = {
  onSelectAddress?: (item: { name: string; address: string }) => void
  onOpenBottomSheet: () => any
  onCloseBottomSheet?: () => any
}

const AddressList = ({ onSelectAddress, onOpenBottomSheet, onCloseBottomSheet }: Props) => {
  const { t } = useTranslation()
  const { addresses, removeAddress } = useAddressBook()

  const items = useMemo(
    () => addresses.filter(({ isAccount }: { isAccount: boolean }) => !isAccount),
    [addresses]
  )

  const renderItem: any = (item: any, i: number) => {
    const isLast = items.length - 1 === i
    const backgroundColor = i % 2 ? colors.listEvenColor : colors.listOddColor
    const onRemoveAddress = () => removeAddress(item.name, item.address)

    const onPressAddress = () => {
      !!onSelectAddress && onSelectAddress(item)
      !!onCloseBottomSheet && onCloseBottomSheet()
    }

    return (
      <TouchableOpacity
        key={item.address + item.name}
        style={[styles.addressItem, { backgroundColor }, isLast && spacings.mb]}
        activeOpacity={0.8}
        onPress={onPressAddress}
      >
        <Blockies seed={item.address} />
        <View style={[flexboxStyles.flex1, spacings.phTy]}>
          <Text style={styles.addressName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={[styles.addressId, textStyles.bold]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {item.address}
          </Text>
        </View>
        <TouchableOpacity style={styles.addressDelete} onPress={onRemoveAddress}>
          <MaterialIcons name="delete-outline" size={20} color={colors.textColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <Title style={textStyles.center}>{t('Address Book')}</Title>
      {!!items.length && items.map(renderItem)}
      {!items.length && (
        <Text style={[textStyles.center, spacings.mb]}>{t('Your address book is empty.')}</Text>
      )}
      <Button
        onPress={() => {
          !!onOpenBottomSheet && onOpenBottomSheet()
          !!onCloseBottomSheet && onCloseBottomSheet()
        }}
        type="outline"
        text={t('Add Address')}
      />
    </>
  )
}

export default AddressList
