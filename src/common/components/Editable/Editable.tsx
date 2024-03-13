import React, { FC, useState } from 'react'
import { Pressable, View } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import EditPenIcon from '@common/assets/svg/EditPenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Input from '../Input'
import Text from '../Text'

interface Props {
  value: string
  fallbackValue?: string
  onSave: (value: string) => void
}

const Editable: FC<Props> = ({ value: defaultValue, fallbackValue = 'Not labeled', onSave }) => {
  const [value, setValue] = useState(defaultValue)
  const [isEditing, setIsEditing] = useState(false)
  const [textWidth, setTextWidth] = useState(0)

  const handleSave = () => {
    onSave(value)
    setIsEditing(false)
  }

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        {
          height: 32
        }
      ]}
    >
      {isEditing ? (
        <Input
          value={value}
          containerStyle={{ ...spacings.mb0, width: textWidth }}
          inputWrapperStyle={{
            height: 32
          }}
          nativeInputStyle={{
            fontSize: 12
          }}
          inputStyle={{
            height: 30,
            ...spacings.phTy
          }}
          onChangeText={setValue}
          onSubmitEditing={handleSave}
          autoFocus
        />
      ) : (
        <Text
          fontSize={16}
          appearance={!value ? 'secondaryText' : 'primaryText'}
          numberOfLines={1}
          onLayout={(e) => {
            setTextWidth(e.nativeEvent.layout.width)
          }}
        >
          {value || fallbackValue}
        </Text>
      )}
      <Pressable
        onPress={() => {
          if (isEditing) {
            handleSave()
            return
          }
          setIsEditing(true)
        }}
        style={[spacings.mlTy]}
      >
        {isEditing ? <CheckIcon width={16} height={16} /> : <EditPenIcon width={16} height={16} />}
      </Pressable>
    </View>
  )
}

export default Editable
