import { useContext } from 'react'

import { StorageContext } from '@modules/common/contexts/storageContext'

export default function useStorageController() {
  const context = useContext(StorageContext)

  if (!context) {
    throw new Error('useStorageController must be used within an StorageProvider')
  }

  return context
}
