import { useContext, useMemo } from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'

export default function useTheme(createStyles) {
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
