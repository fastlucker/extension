import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings, { SPACING_LG } from '@common/styles/spacings'

const AddressBookSection = () => {
  return (
    <View>
      <Text style={spacings.mbXl} fontSize={16} weight="regular">
        Address Book
      </Text>
      <Text fontSize={14}>Your Address Book is empty.</Text>
      <Text fontSize={14} style={{ marginBottom: SPACING_LG * 2 }}>
        Wanna add some?
      </Text>
      <Button
        type="outline"
        style={{
          borderColor: colors.violet,
          width: 300
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
