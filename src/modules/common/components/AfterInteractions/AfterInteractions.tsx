import { ReactNode, useEffect, useRef, useState } from 'react'
import { InteractionManager } from 'react-native'

interface Props {
  children: any
  placeholder?: ReactNode
  enabled?: boolean
}

const AfterInteractions = ({ children, placeholder, enabled = true }: Props) => {
  const [interactionsComplete, setInteractionsComplete] = useState(false)

  const interactionHandle: any = useRef(null)

  useEffect(() => {
    interactionHandle.current = InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true)
      interactionHandle.current = null
    })

    return () => {
      if (interactionHandle.current) {
        interactionHandle.current.cancel()
      }
    }
  }, [])

  if (!enabled) {
    return children
  }

  if (interactionsComplete) {
    return children
  }

  if (placeholder) {
    return placeholder
  }

  return null
}

export default AfterInteractions
