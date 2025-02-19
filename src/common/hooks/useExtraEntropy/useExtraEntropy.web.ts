import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const useExtraEntropy = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number; timestamp: number } | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY, timestamp: e.timeStamp })
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const getExtraEntropy = useCallback(() => {
    const mouseEntropy = mousePos ? `${mousePos.x}-${mousePos.y}-${mousePos.timestamp}` : null
    const extraEntropy = `${mouseEntropy || uuidv4()}-${performance.now()}`

    return extraEntropy
  }, [mousePos])

  return {
    getExtraEntropy
  }
}

export default useExtraEntropy
