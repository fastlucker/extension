import { useContext, useMemo } from 'react'

import { ThemeContext } from '@common/contexts/themeContext'
import { THEME_TYPES } from '@common/styles/themeConfig'

export default function useTheme<CreateStyles>({
  createStyles,
  forceThemeType
}: {
  createStyles?: CreateStyles
  forceThemeType?: THEME_TYPES
} = {}) {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider')
  }

  // Assume that always the return type will match the `CreateStyles` interface.
  // Otherwise - the complexity is too high to TypeScript it.
  // @ts-ignore
  const styles: ReturnType<CreateStyles> = useMemo(
    () => (typeof createStyles === 'function' ? createStyles(context.theme) : {}),
    [context?.theme]
  )

  if (forceThemeType) {
    const themes = {
      [THEME_TYPES.LIGHT]: context.lightThemeStyles,
      [THEME_TYPES.DARK]: context.darkThemeStyles
    }

    // @ts-ignore types mismatch, which is fine
    if (themes[forceThemeType]) context.theme = themes[forceThemeType]
  }

  return {
    ...context,
    styles
  }
}
