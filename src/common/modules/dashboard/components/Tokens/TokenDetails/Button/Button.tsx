import React, { FC } from 'react'
import { View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import text from '@common/styles/utils/text'
import { AnimatedPressable, useCustomHover } from '@web/hooks/useHover'

import getStyles from './styles'

interface Props {
  id: string
  text: string
  onPress: (token: TokenResult) => void
  icon: any
  token: TokenResult
  handleClose: () => void
  isTokenInfoLoading: boolean
  strokeWidth?: number
  isDisabled?: boolean
  testID?: string
}

const TokenDetailsButton: FC<Props> = ({
  id,
  strokeWidth,
  text: btnText,
  isDisabled,
  onPress,
  icon: Icon,
  token,
  handleClose,
  isTokenInfoLoading,
  testID
}) => {
  const { styles, theme } = useTheme(getStyles)
  const [bindAnim, animStyle] = useCustomHover({
    property: 'backgroundColor',
    values: {
      from: theme.primaryBackground,
      to: theme.secondaryBackground
    }
  })
  const isTokenInfo = id === 'info'

  return (
    <AnimatedPressable
      testID={testID}
      key={id}
      style={[styles.action, animStyle, isDisabled && { opacity: 0.4 }]}
      disabled={isDisabled}
      onPress={() => {
        onPress(token)

        handleClose()
      }}
      {...bindAnim}
    >
      <View style={spacings.mbMi}>
        {isTokenInfo && isTokenInfoLoading ? (
          <Spinner style={{ width: 32, height: 32 }} />
        ) : (
          <Icon color={theme.primary} width={32} height={32} strokeWidth={strokeWidth} />
        )}
      </View>
      <Text fontSize={14} weight="medium" style={text.center} numberOfLines={1}>
        {btnText}
      </Text>
    </AnimatedPressable>
  )
}

export default TokenDetailsButton
