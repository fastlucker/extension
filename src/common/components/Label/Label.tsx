import React from 'react'
import { View } from 'react-native'

import WarningIcon from '@common/assets/svg/WarningIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import textStyles from '@common/styles/utils/text'

import getStyles from './styles'

type Props = {
  text: string
  type: 'error' | 'warning' | 'info' | 'success'
  hasBottomSpacing?: boolean
  hasRightSpacing?: boolean
}

const Label = ({ text, type, hasBottomSpacing = true, hasRightSpacing = true }: Props) => {
  const { styles } = useTheme(getStyles)

  const textStyle = [
    textStyles.capitalize,
    textStyles.left,
    type === 'warning' && styles.warningText
  ]

  return (
    <View
      style={[
        styles.container,
        !!hasBottomSpacing && spacings.mbTy,
        !!hasRightSpacing && spacings.mrTy
      ]}
    >
      <View style={spacings.mrTy}>
        {type === 'warning' && <WarningIcon width={20} height={19} />}
      </View>
      <Text>
        <Text fontSize={16} weight="semiBold" style={textStyle}>
          {`${type}: `}
        </Text>
        <Text fontSize={16} weight="regular" style={textStyle}>
          {text}
        </Text>
      </Text>
    </View>
  )
}

export default Label
