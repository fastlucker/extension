import { Platform } from 'react-native'

import i18n from '@config/localization/localization'
import { DEVICE_SUPPORTED_AUTH_TYPES } from '@modules/common/contexts/passcodeContext/constants'

export const getDeviceSupportedAuthTypesLabel = (types: DEVICE_SUPPORTED_AUTH_TYPES[]) => {
  if (Platform.OS === 'ios') {
    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('Face ID or Touch ID')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION)) {
      return i18n.t('Face ID')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)) {
      return i18n.t('Touch ID')
    }
  }

  if (Platform.OS === 'android') {
    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('facial recognition, iris recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('iris recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)
    ) {
      return i18n.t('facial recognition or fingerprint')
    }

    if (
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION) &&
      types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS)
    ) {
      return i18n.t('facial recognition or iris recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FACIAL_RECOGNITION)) {
      return i18n.t('facial recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.IRIS)) {
      return i18n.t('iris recognition')
    }

    if (types.includes(DEVICE_SUPPORTED_AUTH_TYPES.FINGERPRINT)) {
      return i18n.t('fingerprint')
    }
  }

  return ''
}
