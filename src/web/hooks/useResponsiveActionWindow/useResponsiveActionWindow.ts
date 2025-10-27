import { useMemo } from 'react'

import useWindowSize from '@common/hooks/useWindowSize'

const useResponsiveActionWindow = () => {
  const { minHeightSize } = useWindowSize()

  const responsiveSizeMultiplier = useMemo(() => {
    if (minHeightSize(600)) return 0.75
    if (minHeightSize(650)) return 0.8
    if (minHeightSize(700)) return 0.9
    if (minHeightSize(750)) return 0.95

    return 1
  }, [minHeightSize])

  return { responsiveSizeMultiplier }
}

export default useResponsiveActionWindow
