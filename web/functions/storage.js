import { browserAPI } from '../constants/browserAPI.js'

export const getStorage = async (keys) =>
  new Promise((res) => {
    browserAPI.storage.local.get(keys, (result) => {
      res(result)
    })
  })
