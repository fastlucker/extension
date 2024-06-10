import React, { FC, useCallback, useState } from 'react'
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
  initialValue?: string
  fallbackValue?: string
  onSave?: (value: string) => void
  fontSize?: number
  height?: number
  textProps?: TextProps
  minWidth?: number
  maxLength?: number
  customValue?: string
  setCustomValue?: (value: string) => void
  testID?: string
}

const Editable: FC<Props> = ({
  initialValue,
  fallbackValue = 'Not labeled',
  customValue, // needed for react-hook-form
  setCustomValue, // needed for react-hook-form
  onSave,
  fontSize = 16,
  height = 30,
  textProps = {},
  minWidth = 80,
  maxLength = 20,
  testID
}) => {
  const { theme } = useTheme()
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)
  const [textWidth, setTextWidth] = useState(0)
  const actualValue = typeof customValue === 'string' ? customValue : value

  const handleSave = useCallback(() => {
    setIsEditing(false)
    if (actualValue === initialValue || !actualValue) {
      setValue(initialValue)
      return
    }

    if (onSave) onSave(actualValue)
  }, [actualValue, initialValue, onSave])

  const setValueWrapped = useCallback(
    (newValue: string) => {
      if (setCustomValue) {
        setCustomValue(newValue)
        return
      }

      setValue(newValue)
    },
    [setCustomValue]
  )

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
          value={actualValue}
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
          onChangeText={setValueWrapped}
          onSubmitEditing={handleSave}
          autoFocus
          borderless
          testID={testID}
        />
      ) : (
        <Text
          fontSize={fontSize}
          appearance={!actualValue ? 'secondaryText' : 'primaryText'}
          numberOfLines={1}
          // onLayout returns rounded numbers in react-native-web so there
          // there will be slight UI jumps when changing the value of isEditing
          // https://github.com/necolas/react-native-web/issues/2424
          onLayout={(e) => {
            setTextWidth(e.nativeEvent.layout.width)
          }}
          {...textProps}
        >
          {actualValue || fallbackValue}
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
        testID="editable-button"
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
            {isEditing && (actualValue === initialValue || !actualValue) && (
              <CloseIcon
                width={fontSize}
                height={fontSize}
                color={hovered ? theme.primaryText : theme.secondaryText}
              />
            )}
            {isEditing && actualValue !== initialValue && !!actualValue && (
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
