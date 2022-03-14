import React, { createContext, useCallback, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import useStorage from '@modules/common/hooks/useStorage'
import ThemeColors, { Styles, Themes } from '@modules/common/styles/ themeConfig'

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
    const theme: any = {}

    // Defaults to a dark theme
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(ThemeColors)) {
      theme[key] = ThemeColors[key as Styles][(type as Themes) || THEME_TYPES.DARK]
    }

    return theme
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
