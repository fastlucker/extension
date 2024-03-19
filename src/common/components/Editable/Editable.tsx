import React, { FC, useState } from 'react'
import { Pressable, View } from 'react-native'

import CheckIcon from '@common/assets/svg/CheckIcon'
import CloseIcon from '@common/assets/svg/CloseIcon'
import EditPenIcon from '@common/assets/svg/EditPenIcon'
import useTheme from '@common/hooks/useTheme'
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
  maxLength?: number
}

const Editable: FC<Props> = ({
  value: defaultValue,
  fallbackValue = 'Not labeled',
  onSave,
  fontSize = 16,
  height = 30,
  textProps = {},
  minWidth = 80,
  maxLength = 20
}) => {
  const { theme } = useTheme()
  const [value, setValue] = useState(defaultValue)
  const [isEditing, setIsEditing] = useState(false)
  const [textWidth, setTextWidth] = useState(0)

  const handleSave = () => {
    setIsEditing(false)
    if (value === defaultValue || !value) {
      setValue(defaultValue)
      return
    }
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
          maxLength={maxLength}
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
        {({ hovered }: any) => (
          <>
            {!isEditing && (
              <EditPenIcon
                color={hovered ? theme.primaryText : theme.secondaryText}
                width={fontSize}
                height={fontSize}
              />
            )}
            {isEditing && (value === defaultValue || !value) && (
              <CloseIcon
                width={fontSize}
                height={fontSize}
                color={hovered ? theme.primaryText : theme.secondaryText}
              />
            )}
            {isEditing && value !== defaultValue && !!value && (
              <View style={{ opacity: hovered ? 0.9 : 1 }}>
                <CheckIcon width={fontSize} height={fontSize} />
              </View>
            )}
          </>
        )}
      </Pressable>
    </View>
  )
}

export default Editable
