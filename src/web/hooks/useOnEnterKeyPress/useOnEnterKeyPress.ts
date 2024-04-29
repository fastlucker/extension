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
      // It the button is not 'Enter', we don't care.
      if (e.key !== 'Enter') return

      // If the hook is disabled (i.e., if the form is in the process of submitting, or there's a validation error),
      // we should not allow submission with 'Enter'.
      if (disabled) return

      // If the user holds the 'Enter' key down, we should prevent calling the `action` multiple times.
      if (e.repeat) return

      // We exclude some of the input or submit tags, as they already have an onClick/onSubmit callback (action) that performs a form submission.
      // If we skip this step, the user hitting the 'Enter' button would result in the action callback function being submitted twice.
      const tagName = (e.target as HTMLElement)?.tagName
      const excludedTags = ['BUTTON', 'INPUT']
      const isTagAllowed = !excludedTags.includes(tagName)

      if (isTagAllowed) {
        e.preventDefault()
        e.stopPropagation()

        // @ts-ignore
        action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, action])
}

export default useOnEnterKeyPress
