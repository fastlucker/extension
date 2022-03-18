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
      setPermissionGranted(permissionStatus === 'granted')
    })()
  }, [])

  return permissionGranted ? children : <P>Please grant!</P>
}

export default RequireLocation
