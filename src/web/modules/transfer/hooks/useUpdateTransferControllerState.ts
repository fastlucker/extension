import { useEffect } from 'react'

import useBackgroundService from '@web/hooks/useBackgroundService'

interface Props<T> {
  isUpdatingLocalState: boolean
  state: T
  key: string
}

function useUpdateTransferControllerState<T>({ isUpdatingLocalState, state, key }: Props<T>) {
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    // Local state --- > Controller state update on state change
    // Don't update the controller state if the local state isn't up to date
    if (isUpdatingLocalState) return

    // Debounced for performance
    const timeout = setTimeout(() => {
      dispatch({
        type: 'MAIN_CONTROLLER_TRANSFER_UPDATE',
        params: {
          [key]: state
        }
      })
    }, 200)

    return () => {
      clearTimeout(timeout)
    }
  }, [state, dispatch, isUpdatingLocalState, key])
}

export default useUpdateTransferControllerState
