import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import { SwapController } from '@ambire-common/controllers/swap/swap'
import Spinner from '@common/components/Spinner'
import flexbox from '@common/styles/utils/flexbox'

type ContextReturn = {
  state: SwapController
  swapCtrl: SwapController
}

const SwapControllerStateContext = createContext<ContextReturn>({} as ContextReturn)

const SwapControllerStateProvider: React.FC<any> = ({ children }) => {
  const [state, setState] = useState<SwapController>({} as SwapController)
  const swapCtrlRef = useRef<SwapController | null>(null)
  const swapCtrl = swapCtrlRef.current

  useEffect(() => {
    if (!swapCtrl) return

    swapCtrl.onUpdate(() => {
      setState(swapCtrl.toJSON())
    })
  }, [swapCtrl])

  useEffect(() => {
    // Don't reinit the controller if it already exists. Only update its properties
    if (swapCtrl) return

    swapCtrlRef.current = new SwapController()
    setState(swapCtrlRef.current.toJSON())
  }, [swapCtrl])

  return (
    <SwapControllerStateContext.Provider
      value={useMemo(
        // Typecasting to SwapController is safe because children are rendered only when state is not empty
        () => ({ state, swapCtrl: swapCtrl as SwapController }),
        [state, swapCtrl]
      )}
    >
      {Object.keys(state).length ? (
        children
      ) : (
        <View style={[flexbox.flex1, flexbox.center]}>
          <Spinner />
        </View>
      )}
    </SwapControllerStateContext.Provider>
  )
}

export { SwapControllerStateProvider, SwapControllerStateContext }
