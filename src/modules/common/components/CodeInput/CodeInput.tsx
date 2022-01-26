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
}

const CodeInput: React.FC<Props> = ({ onFulfill, ...rest }) => {
  const [value, setValue] = useState('')
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })

  useEffect(() => {
    if (value.length >= 6) {
      onFulfill(value)
    }
  }, [value])

  const renderCell: CodeFieldProps['renderCell'] = ({ index, symbol, isFocused }) => (
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
      <Text style={styles.cellText}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
    </View>
  )

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="password"
      {...rest}
      renderCell={renderCell}
    />
  )
}

export default CodeInput
