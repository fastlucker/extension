import useStorage, { UseStorageProps } from 'ambire-common/src/hooks/useStorage'
import { useContext } from 'react'

import { StorageContext } from '@modules/common/contexts/storageContext'

// import { SyncStorage } from '@config/storage'

export default function useSyncStorage<ValueType>({
  key,
  defaultValue,
  isStringStorage,
  setInit
}: Omit<UseStorageProps<ValueType>, 'storage'>) {
  // TODO: Move to another hook maybe?
  const storageContext = useContext(StorageContext)

  return useStorage<ValueType>({
    // storage: SyncStorage,
    storage: storageContext,
    key,
    defaultValue,
    isStringStorage,
    setInit
  })
}
