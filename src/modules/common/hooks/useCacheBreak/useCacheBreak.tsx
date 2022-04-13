import { useEffect, useState } from 'react'

interface Props {
  breakPoint?: number
  refreshInterval?: number
}

export default function useCacheBreak({ breakPoint = 5000, refreshInterval = 30000 }: Props) {
  const [cacheBreak, setCacheBreak] = useState(() => Date.now())

  useEffect(() => {
    if (Date.now() - cacheBreak > breakPoint) setCacheBreak(Date.now())
    const intvl = setTimeout(() => setCacheBreak(Date.now()), refreshInterval)

    return () => clearTimeout(intvl)
  }, [cacheBreak])

  return { cacheBreak }
}
