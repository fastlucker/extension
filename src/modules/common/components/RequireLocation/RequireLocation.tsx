import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native'

import P from '@modules/common/components/P'

const RequireLocation: React.FC = ({ children }) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  useEffect(() => {
    ;(async () => {
      const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      setPermissionGranted(permissionStatus === PermissionsAndroid.RESULTS.GRANTED)
    })()
  }, [])

  return permissionGranted ? (
    children
  ) : (
    <P>
      {t('Please turn on Location services first, in order to connect to hardware wallet devices.')}
    </P>
  )
}

export default RequireLocation
