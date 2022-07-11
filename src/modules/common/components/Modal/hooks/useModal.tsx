import { useCallback, useState } from 'react'

export interface UseModalReturnType {
  isModalVisible: boolean
  showModal: () => void
  hideModal: () => void
}

export default function useModal(): UseModalReturnType {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = useCallback(() => {
    setIsModalVisible(true)
  }, [])

  const hideModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  return { isModalVisible, showModal, hideModal }
}
