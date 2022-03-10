import React, { createContext, useMemo } from 'react'

import useStorage from '@modules/common/hooks/useStorage'
import darkThemeColors from '@modules/common/styles/darkThemeColors'
import lightThemeColors from '@modules/common/styles/lightThemeColors'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum THEME_TYPES {
  LIGHT = 'light',
  DARK = 'dark'
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
  const [themeType, setThemeType] = useStorage({ key: 'theme', defaultValue: THEME_TYPES.DARK })

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          theme: themeType === THEME_TYPES.LIGHT ? lightThemeColors : darkThemeColors,
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
