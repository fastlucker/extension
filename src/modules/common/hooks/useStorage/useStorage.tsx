import { useContext } from 'react'

import { StorageContext } from '@modules/common/contexts/storageContext'
import useStorage from '@shared/src/hooks/useStorage'

export default function useSyncStorage({ key, defaultValue, isStringStorage, setInit }: any) {
  const { SyncStorage } = useContext(StorageContext)
  return useStorage({ storage: SyncStorage, key, defaultValue, isStringStorage, setInit })
}
