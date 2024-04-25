import { useEffect } from 'react'
import { PressableProps } from 'react-native'

interface Props {
  action: PressableProps['onPress']
  disabled?: boolean
}

const useOnEnterKeyPress = ({ action, disabled }: Props) => {
  useEffect(() => {
    if (!action) return

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.key === 'Enter') {
        if (disabled) return
        // @ts-ignore
        action()
      }
    }

    window.addEventListener('keyup', handleKeyDown)

    return () => window.removeEventListener('keyup', handleKeyDown)
  }, [disabled, action])
}

export default useOnEnterKeyPress
