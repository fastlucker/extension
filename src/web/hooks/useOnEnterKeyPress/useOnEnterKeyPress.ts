import { useEffect } from 'react'

interface Props {
  action: () => void
  disabled?: boolean
}

const useOnEnterKeyPress = ({ action, disabled }: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (disabled) return
        action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, action])
}

export default useOnEnterKeyPress
