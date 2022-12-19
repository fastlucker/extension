import React, { createContext } from 'react'

import { vaultBiometricsContextDefaults, VaultBiometricsContextReturnType } from './types'

const VaultBiometricsContext = createContext<VaultBiometricsContextReturnType>(
  vaultBiometricsContextDefaults
)

// This context is needed for the mobile app only. For web, fallback to defaults.
const VaultBiometricsProvider: React.FC = ({ children }) => children

export { VaultBiometricsContext, VaultBiometricsProvider }
