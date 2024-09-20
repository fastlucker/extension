import React, { createContext, useMemo } from 'react'

import ThemeColors, { ThemeProps } from './themeConfig'

export interface ThemeContextReturnType {
  theme: ThemeProps
}

const ThemeContext = createContext<ThemeContextReturnType>({
  theme: {} as ThemeProps
})

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = ThemeColors

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => ({
          theme
        }),
        [theme]
      )}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeProvider }
