import { useEffect } from 'react'

interface Props {
  action: () => void
  disabled?: boolean
}

const useOnEnterKeyPress = ({ action, disabled }: Props) => {
  // Move to next story on enter key press
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (disabled) return
        action()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [disabled, action])
}

export default useOnEnterKeyPress
