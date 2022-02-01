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
import usePrevious from '@modules/common/hooks/usePrevious'

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

  const prevAutoFocus = usePrevious(autoFocus)

  useEffect(() => {
    setTimeout(() => {
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

  useEffect(() => {
    if (!prevAutoFocus && autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus, prevAutoFocus])

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
