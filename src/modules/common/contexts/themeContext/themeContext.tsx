import React, { createContext, useEffect, useMemo, useState } from 'react'
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
  // Migrating from v2.x to v3.x where the theme type was stored wrapped in quotes
  const isMigrationNeeded =
    !!themeType && themeType[0] === '"' && themeType[themeType.length - 1] === '"'
  const [hasMigrated, setHasMigrated] = useState<boolean>(!isMigrationNeeded)

  useEffect(() => {
    if (hasMigrated) return

    // Removes the wrapping quotes from the `themeType` coming from the storage
    const migratedThemeType = themeType!.slice(1, -1) as THEME_TYPES
    setThemeType(migratedThemeType)

    setHasMigrated(true)
  }, [hasMigrated, setHasMigrated, setThemeType, themeType])

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
      {hasMigrated && children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
