import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'

const AddressBookSection = () => {
  return (
    <View>
      <Text style={spacings.mbSm} fontSize={16} weight="regular">
        Address Book
      </Text>
      <Text fontSize={14}>Your Address Book is empty.</Text>
      <Text fontSize={14} style={spacings.mbXl}>
        Wanna add some?
      </Text>
      <Button
        type="outline"
        style={{
          borderColor: colors.violet,
          width: 300
        }}
        // @TODO: implement address book
        disabled
        disabledStyle={{
          opacity: 0.6
        }}
        textStyle={{
          color: colors.violet
        }}
        text="Add Address"
      />
    </View>
  )
}

export default AddressBookSection
