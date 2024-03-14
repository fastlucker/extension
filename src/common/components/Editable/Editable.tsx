import React, { FC, useState } from 'react'
import { Pressable, View } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import EditPenIcon from '@common/assets/svg/EditPenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import Input from '../Input'
import Text, { Props as TextProps } from '../Text'

interface Props {
  value: string
  fallbackValue?: string
  onSave: (value: string) => void
  fontSize?: number
  height?: number
  textProps?: TextProps
  minWidth?: number
}

const Editable: FC<Props> = ({
  value: defaultValue,
  fallbackValue = 'Not labeled',
  onSave,
  fontSize = 16,
  height = 30,
  textProps = {},
  minWidth = 80
}) => {
  const [value, setValue] = useState(defaultValue)
  const [isEditing, setIsEditing] = useState(false)
  const [textWidth, setTextWidth] = useState(0)

  const handleSave = () => {
    setIsEditing(false)
    if (value === defaultValue) return
    onSave(value)
  }

  return (
    <View
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        {
          height
        }
      ]}
    >
      {isEditing ? (
        <Input
          value={value}
          // Prevents the input from being too small
          containerStyle={{ ...spacings.mb0, width: textWidth < minWidth ? minWidth : textWidth }}
          inputWrapperStyle={{
            height,
            backgroundColor: 'transparent'
          }}
          nativeInputStyle={{
            fontSize
          }}
          inputStyle={{
            height,
            ...spacings.ph0
          }}
          onChangeText={setValue}
          onSubmitEditing={handleSave}
          autoFocus
          borderless
        />
      ) : (
        <Text
          fontSize={fontSize}
          appearance={!value ? 'secondaryText' : 'primaryText'}
          numberOfLines={1}
          // onLayout returns rounded numbers in react-native-web so there
          // there will be slight UI jumps when changing the value of isEditing
          // https://github.com/necolas/react-native-web/issues/2424
          onLayout={(e) => {
            setTextWidth(e.nativeEvent.layout.width)
          }}
          {...textProps}
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
        {!isEditing && <EditPenIcon width={fontSize} height={fontSize} />}
        {isEditing && value === defaultValue && <CloseIcon width={fontSize} height={fontSize} />}
        {isEditing && value !== defaultValue && <CheckIcon width={fontSize} height={fontSize} />}
      </Pressable>
    </View>
  )
}

export default Editable
