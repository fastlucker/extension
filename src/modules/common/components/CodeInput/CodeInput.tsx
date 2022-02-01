import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  CodeField,
  CodeFieldProps,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field'

import Text from '@modules/common/components/Text'

import styles from './styles'

const CELL_COUNT = 6

interface Props extends Partial<CodeFieldProps> {
  onFulfill: (code: string) => void
  enableMask?: boolean
}

const CodeInput: React.FC<Props> = ({ onFulfill, enableMask = true, autoFocus, ...rest }) => {
  const [value, setValue] = useState('')
  const inputRef = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  useEffect(() => {
    // Timeout for the cases when another component sends keyboard dismiss action right before navigating to another screen containing this CodeInput.
    // There might be some overlap of the dismiss and focus of the keyboard if there is no timeout
    setTimeout(() => {
      // autoFocus can be a static prop and this way it will function as a regular autoFocus
      // When CodeInput should be focused on some other action (not component render), the autoFocus can be used as a boolean state
      //  in the parent component and trigger the focus when changing: false -> true
      if (autoFocus) {
        inputRef.current?.focus()
      }
    }, 200)
  }, [autoFocus])

  useEffect(() => {
    if (value.length >= 6) {
      onFulfill(value)
      setValue('')
    }
  }, [value])

  const renderCell: CodeFieldProps['renderCell'] = ({ index, symbol, isFocused }) => {
    let textChild = null

    if (symbol) {
      textChild = enableMask ? '•' : symbol
    } else if (isFocused) {
      textChild = <Cursor />
    }

    return (
      // React Native have issue with border styles for <Text/> on iOS.
      // {@link https://github.com/facebook/react-native/issues/23537}
      // To fix it need <View/> wrapper for Cell, but also move
      // onLayout={getCellOnLayoutHandler(index) to <View/>:
      <View
        // Moves the onLayout={getCellOnLayoutHandler(index)} prop
        // to root component of "Cell", because of the issue mentioned above.
        onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[styles.cellRoot, isFocused && styles.focusCell]}
      >
        <Text style={styles.cellText}>{textChild}</Text>
      </View>
    )
  }

  return (
    <CodeField
      ref={inputRef}
      {...props}
      autoFocus={false}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="numeric"
      textContentType="password"
      {...rest}
      renderCell={renderCell}
    />
  )
}

export default CodeInput
