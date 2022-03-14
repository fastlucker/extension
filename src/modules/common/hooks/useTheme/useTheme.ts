import { useContext, useMemo } from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'
import { ThemeColorsConfig } from '@modules/common/styles/ themeConfig'

export default function useTheme(createStyles: (theme: ThemeColorsConfig) => any) {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider')
  }

  const styles = useMemo(
    () => (typeof createStyles === 'function' ? createStyles(context.theme) : {}),
    [context?.theme]
  )

  return {
    ...context,
    styles
  }
}
