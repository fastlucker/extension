import * as LocalAuthentication from 'expo-local-authentication'
import React, { createContext, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'

import i18n from '@config/localization/localization'
import { AUTH_STATUS } from '@modules/auth/constants/authStatus'
import useAuth from '@modules/auth/hooks/useAuth'
import { getDeviceSupportedAuthTypesLabel } from '@modules/common/services/device'

import { DEVICE_SECURITY_LEVEL, DEVICE_SUPPORTED_AUTH_TYPES } from './constants'
import { biometricsContextDefaults, BiometricsContextReturnType } from './types'

const BiometricsContext = createContext<BiometricsContextReturnType>(biometricsContextDefaults)

const BiometricsProvider: React.FC = ({ children }) => {
  const { authStatus } = useAuth()

  const [deviceSecurityLevel, setDeviceSecurityLevel] = useState<DEVICE_SECURITY_LEVEL>(
    biometricsContextDefaults.deviceSecurityLevel
  )
  const [deviceSupportedAuthTypes, setDeviceSupportedAuthTypes] = useState<
    DEVICE_SUPPORTED_AUTH_TYPES[]
  >(biometricsContextDefaults.deviceSupportedAuthTypes)
  const [deviceSupportedAuthTypesLabel, setDeviceSupportedAuthTypesLabel] = useState<string>(
    biometricsContextDefaults.deviceSupportedAuthTypesLabel
  )
  const [hasBiometricsHardware, setHasBiometricsHardware] = useState<null | boolean>(
    biometricsContextDefaults.hasBiometricsHardware
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      // App lock and biometrics sign logic gets triggered
      // only for logged in users. So if not logged in - no need to trigger.
      if (authStatus !== AUTH_STATUS.AUTHENTICATED) return

      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        setHasBiometricsHardware(hasHardware)
      } catch {
        // Assume device doesn't have biometrics hardware, that's fine.
      }

      try {
        const securityLevel = await LocalAuthentication.getEnrolledLevelAsync()
        const existingDeviceSecurityLevel =
          // @ts-ignore `LocalAuthentication.SecurityLevel` and `DEVICE_SECURITY_LEVEL`
          // overlap each other. So this should match.
          Object.values(DEVICE_SECURITY_LEVEL).includes(securityLevel)
        setDeviceSecurityLevel(
          // @ts-ignore `LocalAuthentication.SecurityLevel` and `DEVICE_SECURITY_LEVEL`
          // overlap each other. So this should always result a valid setting.
          existingDeviceSecurityLevel ? securityLevel : DEVICE_SECURITY_LEVEL.NONE
        )
      } catch {
        // Assume the lowest device security level (the default one), that's fine.
      }

      try {
        const deviceAuthTypes = await LocalAuthentication.supportedAuthenticationTypesAsync()
        // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
        // overlap each other. So these should match.
        setDeviceSupportedAuthTypes(deviceAuthTypes)
        // @ts-ignore `LocalAuthentication.AuthenticationType` and `DEVICE_SUPPORTED_AUTH_TYPES`
        // overlap each other. So these should match.
        setDeviceSupportedAuthTypesLabel(getDeviceSupportedAuthTypesLabel(deviceAuthTypes))
      } catch {
        // Fallback with defaults, that's fine.
      }

      setIsLoading(false)
    })()
  }, [authStatus])

  const fallbackSupportedAuthTypesLabel =
    Platform.select({
      ios: i18n.t('passcode'),
      android: i18n.t('PIN / pattern')
    }) || biometricsContextDefaults.fallbackSupportedAuthTypesLabel

  return (
    <BiometricsContext.Provider
      value={useMemo(
        () => ({
          isLoading,
          hasBiometricsHardware,
          deviceSecurityLevel,
          deviceSupportedAuthTypes,
          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel
        }),
        [
          isLoading,
          hasBiometricsHardware,
          deviceSecurityLevel,
          deviceSupportedAuthTypes,
          deviceSupportedAuthTypesLabel,
          fallbackSupportedAuthTypesLabel
        ]
      )}
    >
      {children}
    </BiometricsContext.Provider>
  )
}

export { BiometricsContext, BiometricsProvider }
