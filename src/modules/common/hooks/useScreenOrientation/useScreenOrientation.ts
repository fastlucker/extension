import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

type OrientationType = 'portrait' | 'landscape'

function useScreenOrientation() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait')

  useEffect(() => {
    const onChange = ({ window: { width, height } }: any) => {
      if (width < height) {
        setOrientation('portrait')
      } else {
        setOrientation('landscape')
      }
    }

    Dimensions.addEventListener('change', onChange)

    return () => Dimensions.removeEventListener('change', onChange)
  }, [])

  return orientation
}

export default useScreenOrientation
