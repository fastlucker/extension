import React, { createContext } from 'react'

import {
  AmbireExtensionContextReturnType,
  AmbireExtensionContextReturnTypeDefaults
} from './ambireExtensionContext.web'

const AmbireExtensionContext = createContext<AmbireExtensionContextReturnType>(
  AmbireExtensionContextReturnTypeDefaults
)

// This context is needed for the web app only. For mobile, fallback to defaults.
const AmbireExtensionProvider: React.FC = ({ children }) => children

export { AmbireExtensionContext, AmbireExtensionProvider }
