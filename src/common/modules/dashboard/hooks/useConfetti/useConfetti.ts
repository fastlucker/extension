import { useEffect, useState } from 'react'

const useConfetti = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible) setTimeout(() => setVisible(false), 4700)
  }, [visible])

  return {
    visible,
    setVisible
  }
}

export default useConfetti
