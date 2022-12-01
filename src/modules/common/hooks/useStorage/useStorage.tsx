import useStorage, { UseStorageProps } from 'ambire-common/src/hooks/useStorage'

import useStorageController from '../useStorageController'

// import { SyncStorage } from '@config/storage'

export default function useSyncStorage<ValueType>({
  key,
  defaultValue,
  isStringStorage,
  setInit
}: Omit<UseStorageProps<ValueType>, 'storage'>) {
  const storage = useStorageController()

  return useStorage<ValueType>({
    // storage: SyncStorage,
    storage,
    key,
    defaultValue,
    isStringStorage,
    setInit
  })
}
