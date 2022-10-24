import React, { createContext } from 'react'

import {
  ambireExtensionContextDefaults,
  AmbireExtensionContextReturnType
} from './ambireExtensionContext.web'

const AmbireExtensionContext = createContext<AmbireExtensionContextReturnType>(
  ambireExtensionContextDefaults
)

// This context is needed for the web app only. For mobile, fallback to defaults.
const AmbireExtensionProvider: React.FC = ({ children }) => children

export { AmbireExtensionContext, AmbireExtensionProvider }
