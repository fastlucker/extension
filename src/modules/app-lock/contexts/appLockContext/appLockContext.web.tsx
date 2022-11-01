import React, { createContext } from 'react'

import { appLockContextDefaults, AppLockContextReturnType } from './types'

const PasscodeContext = createContext<AppLockContextReturnType>(appLockContextDefaults)

// This context is needed for the mobile app only. For web, fallback to defaults.
const PasscodeProvider: React.FC = ({ children }) => children

export { PasscodeContext, PasscodeProvider }
