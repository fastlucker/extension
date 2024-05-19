import humanizerJSON from '@ambire-common/consts/humanizer/humanizerInfo.json'
import { HumanizerMeta } from '@ambire-common/libs/humanizer/interfaces'
import { HUMANIZER_META_KEY } from '@ambire-common/libs/humanizer/utils'
import { Storage } from '@ambire-common/interfaces/storage'

export async function updateHumanizerMetaInStorage(storage: Storage) {
  const humanizerMetaInStorage: HumanizerMeta = await storage.get(HUMANIZER_META_KEY, {})
  // these checks are sfficient for knowing whether there is new hardcoded humanizer info json
  // when a user updates the extension this will update the humanizer meta record in the storage if needed
  if (
    (humanizerMetaInStorage && Object.keys(humanizerMetaInStorage).length === 0) ||
    // check for new added address
    Object.keys(humanizerMetaInStorage.knownAddresses).length <
      Object.keys(humanizerJSON.knownAddresses).length ||
    // check for new added contract abi
    Object.keys(humanizerMetaInStorage.abis).length < Object.keys(humanizerJSON.abis).length ||
    // check for new added function selector
    Object.keys(humanizerMetaInStorage.abis.NO_ABI).length <
      Object.keys(humanizerJSON.abis.NO_ABI).length
  )
    await storage.set(HUMANIZER_META_KEY, humanizerJSON)
}
