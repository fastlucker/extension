import React, { createContext, useCallback, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import useStorage from '@modules/common/hooks/useStorage'
import darkThemeColors from '@modules/common/styles/darkThemeColors'
import lightThemeColors from '@modules/common/styles/lightThemeColors'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark',
  // When the theme type is set to auto by the user, the app will get the system theme
  AUTO = 'auto'
}

type ThemeContextData = {
  theme: any
  themeType: THEME_TYPES
  setThemeType: (item: any) => void
}

const ThemeContext = createContext<ThemeContextData>({
  theme: {},
  themeType: THEME_TYPES.DARK,
  setThemeType: () => {}
})

const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme()
  const [themeType, setThemeType] = useStorage({
    key: 'theme',
    defaultValue: THEME_TYPES.AUTO
  })

  const setTheme = useCallback(() => {
    const type = themeType === THEME_TYPES.AUTO ? colorScheme : themeType

    if (!type) {
      // Defaults to a dark theme
      return darkThemeColors
    }
    // Light theme if the theme type is light
    // Dark theme in all other cases
    return type === THEME_TYPES.LIGHT ? lightThemeColors : darkThemeColors
  }, [themeType])

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          theme: setTheme(),
          themeType,
          setThemeType
        }),
        [themeType, setThemeType]
      )}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
