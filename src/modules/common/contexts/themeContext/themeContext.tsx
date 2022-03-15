import React, { createContext, useCallback, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import useStorage from '@modules/common/hooks/useStorage'
import ThemeColors, { THEME_TYPES, ThemeProps } from '@modules/common/styles/themeConfig'

type ThemeContextData = {
  theme?: ThemeProps
  themeType: THEME_TYPES
  setThemeType: (item: any) => void
}

const ThemeContext = createContext<ThemeContextData>({
  themeType: THEME_TYPES.DARK,
  setThemeType: () => {}
})

const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme()
  const [themeType, setThemeType] = useStorage({
    key: 'theme',
    // Maybe change the default theme to `auto` once the light theme is ready
    defaultValue: THEME_TYPES.DARK
  })

  const setTheme = useCallback(() => {
    const type = themeType === THEME_TYPES.AUTO ? colorScheme : themeType
    const theme: any = {}
    // Defaults to a dark theme
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(ThemeColors)) {
      // @ts-ignore
      theme[key] = ThemeColors[key][type || THEME_TYPES.DARK]
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
