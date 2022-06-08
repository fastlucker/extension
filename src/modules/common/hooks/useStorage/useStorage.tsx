import useStorage from 'ambire-common/src/hooks/useStorage'

import { SyncStorage } from '@modules/common/contexts/storageContext'

export default function useSyncStorage({ key, defaultValue, isStringStorage, setInit }: any) {
  return useStorage({ storage: SyncStorage, key, defaultValue, isStringStorage, setInit })
}
