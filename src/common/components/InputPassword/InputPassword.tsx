import React, { useState } from 'react'

import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Input, { InputProps } from '@common/components/Input'
import useTheme from '@common/hooks/useTheme'
import colors from '@common/styles/colors'
import { THEME_TYPES } from '@common/styles/themeConfig'

interface Props extends InputProps {}

const InputPassword: React.FC<Props> = ({
  onChangeText,
  themeType = THEME_TYPES.DARK,
  ...rest
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true)

  const handleToggleSecureTextEntry = () => setSecureTextEntry(!secureTextEntry)

  const { styles: defaultThemeStyles, lightThemeStyles, darkThemeStyles } = useTheme()
  const themeStyles =
    themeType === THEME_TYPES.AUTO
      ? defaultThemeStyles
      : themeType === THEME_TYPES.LIGHT
      ? lightThemeStyles
      : darkThemeStyles

  return (
    <Input
      secureTextEntry={secureTextEntry}
      autoCorrect={false}
      button={
        secureTextEntry ? (
          <VisibilityIcon color={themeStyles.inputIcon} />
        ) : (
          <InvisibilityIcon color={themeStyles.inputIcon} />
        )
      }
      onButtonPress={handleToggleSecureTextEntry}
      onChangeText={onChangeText}
      themeType={themeType}
      {...rest}
    />
  )
}

export default React.memo(InputPassword)
