import React, { createContext, useMemo } from 'react'
import { useColorScheme } from 'react-native'

import useStorage from '@modules/common/hooks/useStorage'
import ThemeColors, { THEME_TYPES, ThemeProps } from '@modules/common/styles/themeConfig'

// Change the default theme to `auto` once the light theme is ready
const DEFAULT_THEME = THEME_TYPES.DARK

export interface ThemeContextReturnType {
  theme?: ThemeProps
  themeType: THEME_TYPES
  setThemeType: (item: THEME_TYPES) => void
}

const ThemeContext = createContext<ThemeContextReturnType>({
  themeType: THEME_TYPES.DARK,
  setThemeType: () => {}
})

const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme()
  const [themeType, setThemeType] = useStorage<THEME_TYPES>({
    key: 'theme',
    defaultValue: DEFAULT_THEME,
    isStringStorage: true
  })

  const theme = useMemo(() => {
    const type = themeType === THEME_TYPES.AUTO ? colorScheme : themeType
    const currentTheme: any = {}
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(ThemeColors)) {
      // @ts-ignore
      currentTheme[key] = ThemeColors[key][type || DEFAULT_THEME]
    }

    return currentTheme
  }, [themeType, colorScheme])

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          theme,
          themeType: themeType || DEFAULT_THEME,
          setThemeType
        }),
        [themeType, setThemeType, theme]
      )}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
