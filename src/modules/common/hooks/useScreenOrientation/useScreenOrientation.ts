import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

type OrientationType = 'portrait' | 'landscape'

function useScreenOrientation() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait')

  useEffect(() => {
    Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      if (width < height) {
        setOrientation('portrait')
      } else {
        setOrientation('landscape')
      }
    })
  }, [])

  return orientation
}

export default useScreenOrientation
