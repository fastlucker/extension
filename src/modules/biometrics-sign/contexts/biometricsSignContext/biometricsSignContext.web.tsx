import React, { createContext } from 'react'

import { biometricsSignContextDefaults, BiometricsSignContextReturnType } from './types'

const BiometricsSignContext = createContext<BiometricsSignContextReturnType>(
  biometricsSignContextDefaults
)

// This context is needed for the mobile app only. For web, fallback to defaults.
const BiometricsSignProvider: React.FC = ({ children }) => children

export { BiometricsSignContext, BiometricsSignProvider }
