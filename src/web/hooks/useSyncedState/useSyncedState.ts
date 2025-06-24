import React, { useEffect, useState } from 'react'

const DEBOUNCE_MS = 500

const getForceUpdateIdentifier = (forceUpdateOnChangeList?: (string | number | boolean)[]) => {
  return forceUpdateOnChangeList ? forceUpdateOnChangeList.join('-') : ''
}

type Props<T> = {
  /**
   * The background state that needs to be synchronized with the local state.
   */
  backgroundState: T
  /**
   * A dispatch function to update the background state.
   */
  updateBackgroundState: (newState: T) => void
  /**
   * A list of primitive values that, when changed, will trigger an update of the local state.
   * Background state --> Local state
   * @Example - The selected token in transfer changes, which triggers an amount update
   * in the controller. This update must be reflected in the local copy of the state.
   */
  forceUpdateOnChangeList?: (string | number | boolean)[]
}

type ReturnType<T> = [T, (newState: T, skipControllerUpdate?: boolean) => void]

const useSyncedState = <T>({
  backgroundState,
  updateBackgroundState,
  forceUpdateOnChangeList
}: Props<T>): ReturnType<T> => {
  const lastForceUpdateIdentifier = React.useRef(getForceUpdateIdentifier(forceUpdateOnChangeList))
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)
  const [state, setState] = useState<T>(backgroundState)

  const clearDebounceTimeout = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }

  const updateState = (newState: T, skipControllerUpdate?: boolean) => {
    setState(newState)

    if (skipControllerUpdate) return

    clearDebounceTimeout()

    debounceRef.current = setTimeout(() => {
      clearDebounceTimeout()
      updateBackgroundState(newState)
    }, DEBOUNCE_MS)
  }

  const handleTabVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      console.log('Debug: Tab is focused, updating local state with background state')
      setState(backgroundState)
    }
  }

  // Update the local state with the background state when the
  // tab is focused
  useEffect(() => {
    document.addEventListener('visibilitychange', handleTabVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleTabVisibilityChange)
      clearDebounceTimeout()
    }
  }, [backgroundState])

  // Update the local state when one of the force update dependencies changes
  // Example: The selected token in transfer changes, which triggers an amount update
  // in the controller. This update must be reflected in the local copy of the state.
  useEffect(() => {
    const identifier = getForceUpdateIdentifier(forceUpdateOnChangeList)
    if (identifier !== lastForceUpdateIdentifier.current) {
      console.log(
        'Debug: Force update triggered due to change in dependencies:',
        'Old Identifier:',
        lastForceUpdateIdentifier.current,
        'New Identifier:',
        identifier
      )
      lastForceUpdateIdentifier.current = identifier
      setState(backgroundState)
      clearDebounceTimeout()
    }
  }, [forceUpdateOnChangeList])

  return [state, updateState]
}

export default useSyncedState
