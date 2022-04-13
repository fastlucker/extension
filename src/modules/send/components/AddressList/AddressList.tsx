import React, { useMemo } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import BinIcon from '@assets/svg/BinIcon'
import { useTranslation } from '@config/localization'
import Blockies from '@modules/common/components/Blockies'
import Button from '@modules/common/components/Button'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import { colorPalette as colors } from '@modules/common/styles/colors'
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
    const onRemoveAddress = () => removeAddress(item.name, item.address)

    const onPressAddress = () => {
      !!onSelectAddress && onSelectAddress(item)
      !!onCloseBottomSheet && onCloseBottomSheet()
    }

    return (
      <TouchableOpacity
        key={item.address + item.name}
        style={[styles.addressItem, spacings.mbTy, isLast && spacings.mb]}
        activeOpacity={0.8}
        onPress={onPressAddress}
      >
        <Blockies seed={item.address} />
        <View style={[flexboxStyles.flex1, spacings.phTy]}>
          <Text style={spacings.mbMi} fontSize={12} numberOfLines={1} ellipsizeMode="middle">
            {item.address}
          </Text>
          <Text fontSize={10} numberOfLines={1} color={colors.titan_50}>
            {item.name}
          </Text>
        </View>
        <TouchableOpacity onPress={onRemoveAddress}>
          <BinIcon />
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
