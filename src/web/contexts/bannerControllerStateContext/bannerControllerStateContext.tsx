/* eslint-disable @typescript-eslint/no-shadow */
import React, { createContext, useCallback, useEffect } from 'react'

import { BannerController } from '@ambire-common/controllers/banner/banner'
import useDeepMemo from '@common/hooks/useDeepMemo'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useControllerState from '@web/hooks/useControllerState'
import useMainControllerState from '@web/hooks/useMainControllerState'

const BannerControllerStateContext = createContext<BannerController>({} as BannerController)

const BannerControllerStateProvider: React.FC<any> = ({ children }) => {
  const controller = 'banner'
  const state = useControllerState(controller)
  const { dispatch } = useBackgroundService()
  const mainState = useMainControllerState()

  useEffect(() => {
    if (mainState.isReady && !Object.keys(state).length) {
      dispatch({
        type: 'INIT_CONTROLLER_STATE',
        params: { controller }
      })
    }
  }, [dispatch, mainState.isReady, state])

  const dismissBanner = useCallback(
    (bannerId: string) => {
      dispatch({
        type: 'DISMISS_BANNER',
        params: { bannerId }
      })
    },
    [dispatch]
  )

  const memoizedState = useDeepMemo(
    {
      ...state,
      dismissBanner
    },
    controller
  )

  return (
    <BannerControllerStateContext.Provider value={memoizedState}>
      {children}
    </BannerControllerStateContext.Provider>
  )
}

export { BannerControllerStateProvider, BannerControllerStateContext }
