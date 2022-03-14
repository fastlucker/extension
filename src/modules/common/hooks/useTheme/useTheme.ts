import { useContext, useMemo } from 'react'

import { ThemeContext } from '@modules/common/contexts/themeContext'

export default function useTheme<CreateStyles>(createStyles: CreateStyles) {
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

  return {
    ...context,
    styles
  }
}
