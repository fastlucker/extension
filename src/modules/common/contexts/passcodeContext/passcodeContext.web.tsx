import React, { createContext } from 'react'

import { passcodeContextDefaults, PasscodeContextReturnType } from './passcodeContext.tsx'

const PasscodeContext = createContext<PasscodeContextReturnType>(passcodeContextDefaults)

// This context is needed for the mobile app only. For web, fallback to defaults.
const PasscodeProvider: React.FC = ({ children }) => children

export { PasscodeContext, PasscodeProvider }
