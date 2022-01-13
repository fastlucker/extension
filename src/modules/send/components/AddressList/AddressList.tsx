import React, { useMemo } from 'react'
import { FlatList, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import P from '@modules/common/components/P'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import useAddressBook from '@modules/common/hooks/useAddressBook'
import colors from '@modules/common/styles/colors'

type Props = {
  onSelectAddress?: (item: { name: string; address: string }) => void
  onOpenBottomSheet: () => any
}

const AddressList = ({ onSelectAddress, onOpenBottomSheet }: Props) => {
  const { t } = useTranslation()
  const { addresses, removeAddress } = useAddressBook()

  const items = useMemo(
    () => addresses.filter(({ isAccount }: { isAccount: boolean }) => !isAccount),
    [addresses]
  )

  const renderItem: any = ({ item }: any) => (
    <TouchableOpacity
      style={{
        padding: 8,
        backgroundColor: colors.inputBackgroundColor,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginBottom: 10
      }}
      activeOpacity={0.8}
      onPress={() => {
        !!onSelectAddress && onSelectAddress(item)
      }}
    >
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1}>{item.name}</Text>
        <Text numberOfLines={1}>{item.address}</Text>
      </View>
      <TouchableOpacity onPress={() => removeAddress(item.name, item.address)}>
        <Text>❌</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderAddresses = () => (
    <FlatList
      data={items}
      // TODO: configure more realistic max height
      style={{ maxHeight: 300 }}
      bounces={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.address + item.name}
    />
  )

  return (
    <Panel>
      <Title>{t('Address Book')}</Title>
      {!!items.length && renderAddresses()}
      {!items.length && <P>{t('Your address book is empty')}</P>}
      <Button onPress={onOpenBottomSheet} text={t('➕ Add Address')} />
    </Panel>
  )
}

export default AddressList
