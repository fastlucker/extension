import React, { createContext } from 'react'

import { ConnectionStates, netInfoContextDefaults, NetInfoContextReturnType } from './types'

const NetInfoContext = createContext<NetInfoContextReturnType>(netInfoContextDefaults)

const NetInfoProvider: React.FC = ({ children }) => children

export { NetInfoContext, NetInfoProvider, ConnectionStates }
