import useStorage, { UseStorageProps } from 'ambire-common/src/hooks/useStorage'
import { useContext } from 'react'

import { StorageContext } from '@modules/common/contexts/storageContext'

export default function useSyncStorage<ValueType>({
  key,
  defaultValue,
  isStringStorage,
  setInit
}: Omit<UseStorageProps<ValueType>, 'storage'>) {
  const context = useContext(StorageContext)

  return useStorage<ValueType>({
    storage: context,
    key,
    defaultValue,
    isStringStorage,
    setInit
  })
}
