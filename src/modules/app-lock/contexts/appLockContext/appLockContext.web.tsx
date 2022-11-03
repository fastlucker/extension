import React, { createContext } from 'react'

import { appLockContextDefaults, AppLockContextReturnType } from './types'

const AppLockContext = createContext<AppLockContextReturnType>(appLockContextDefaults)

// This context is needed for the mobile app only. For web, fallback to defaults.
const AppLockProvider: React.FC = ({ children }) => children

export { AppLockContext, AppLockProvider }
