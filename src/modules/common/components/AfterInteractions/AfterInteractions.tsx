import { ReactNode, useEffect, useRef, useState } from 'react'
import { InteractionManager } from 'react-native'

interface Props {
  children: any
  placeholder?: ReactNode
}

const AfterInteractions = ({ children, placeholder }: Props) => {
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

  if (interactionsComplete) {
    return children
  }

  if (placeholder) {
    return placeholder
  }

  return null
}

export default AfterInteractions
