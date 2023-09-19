import React, { createContext, FC, useCallback, useEffect, useMemo, useState } from 'react'

import { Banner, BannersController } from '@web/extension-services/background/controllers/banners'
import eventBus from '@web/extension-services/event/eventBus'
import useBackgroundService from '@web/hooks/useBackgroundService'

export interface BannersContextReturnType {
  state: BannersController
  banners: Banner[]
  addBanner: (banner: Banner) => void
  removeBanner: (id: number) => void
}

interface Props {
  children: React.ReactNode
}

const BannersContext = createContext<BannersContextReturnType | []>([])

const BannersProvider: FC<Props> = ({ children }) => {
  const [state, setState] = useState<BannersController>({} as BannersController)
  const { dispatch } = useBackgroundService()

  useEffect(() => {
    dispatch({
      type: 'INIT_CONTROLLER_STATE',
      params: { controller: 'banners' }
    })
  }, [dispatch])

  useEffect(() => {
    const onUpdate = (newState: BannersController) => {
      setState(newState)
    }

    eventBus.addEventListener('banners', onUpdate)

    return () => eventBus.removeEventListener('banners', onUpdate)
  }, [])

  const addBanner = useCallback(
    (banner: Banner) => {
      dispatch({
        type: 'BANNERS_CONTROLLER_ADD_BANNER',
        params: { banner }
      })
    },
    [dispatch]
  )

  const removeBanner = useCallback(
    async (id: number) => {
      dispatch({
        type: 'BANNERS_CONTROLLER_REMOVE_BANNER',
        params: { id }
      })
    },
    [dispatch]
  )

  const contextValue = useMemo(
    () => ({ state, banners: state?.banners || [], addBanner, removeBanner }),
    [state, addBanner, removeBanner]
  )

  return <BannersContext.Provider value={contextValue}>{children}</BannersContext.Provider>
}

export { BannersContext, BannersProvider }
