import useStorage, { UseStorageProps } from 'ambire-common/src/hooks/useStorage'

import { SyncStorage } from '@config/storage'

export default function useSyncStorage<ValueType>({
  key,
  defaultValue,
  isStringStorage,
  setInit
}: Omit<UseStorageProps<ValueType>, 'storage'>) {
  return useStorage<ValueType>({
    storage: SyncStorage,
    key,
    defaultValue,
    isStringStorage,
    setInit
  })
}
