// @ts-nocheck

/* eslint-disable import/no-mutable-exports */
import { browserAPI } from '@web/constants/browserAPI'

// Storage
// permissions host => true/false
export let PERMISSIONS = {}
// pending notifications asking for user attention (sign / send tx)
export let USER_ACTION_NOTIFICATIONS = {}

export const setPermissions = (permissions) => {
  PERMISSIONS = permissions
}

export const setUserActionNotifications = (userActionNotifications) => {
  USER_ACTION_NOTIFICATIONS = userActionNotifications
}

// bool, if worker got initialized
let storageLoaded
// Used everywhere when we need to access a consistent state of the background worker
// if not loaded, update the state vars with the latest from local storage
export const isStorageLoaded = () =>
  new Promise((res) => {
    if (storageLoaded) {
      res(true)
      return
    }
    browserAPI.storage.local.get(
      ['TAB_INJECTIONS', 'PERMISSIONS', 'USER_ACTION_NOTIFICATIONS'],
      (result) => {
        TAB_INJECTIONS = { ...TAB_INJECTIONS, ...result.TAB_INJECTIONS }
        PERMISSIONS = { ...PERMISSIONS, ...result.PERMISSIONS }
        USER_ACTION_NOTIFICATIONS = {
          ...USER_ACTION_NOTIFICATIONS,
          ...result.USER_ACTION_NOTIFICATIONS
        }
        storageLoaded = true
        browserAPI.storage.local.set({ USER_ACTION_NOTIFICATIONS: {} })
        res(true)
      }
    )
  })

// save tab permissions in local storage
export const savePermissionsInStorage = (cb) => {
  isStorageLoaded().then(() => {
    browserAPI.storage.local.set({ PERMISSIONS }, cb)
  })
}

// save user notifications(when interaction required) in local storage
export const saveUserActionNotificationsInStorage = (cb) => {
  isStorageLoaded().then(() => {
    browserAPI.storage.local.set({ USER_ACTION_NOTIFICATIONS }, cb)
  })
}

function checkForError() {
  const { lastError } = browserAPI.runtime
  if (!lastError) {
    return undefined
  }
  // if it quacks like an Error, its an Error
  if (lastError.stack && lastError.message) {
    return lastError
  }
  // repair incomplete error object (eg chromium v77)
  return new Error(lastError.message)
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _get = async (keys: string[] | null = null) => {
  const { local } = browserAPI.storage
  return new Promise((resolve, reject) => {
    local.get(keys).then((/** @type {any} */ result) => {
      const err = checkForError()
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _remove = async (keys: string[] | null = null) => {
  const { local } = browserAPI.storage
  return new Promise((resolve, reject) => {
    local.remove(keys).then((/** @type {any} */ result) => {
      const err = checkForError()
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _setAll = async (obj: { [key: string]: any }) => {
  const { local } = browserAPI.storage
  return new Promise((resolve, reject) => {
    local.set(obj).then(() => {
      const err = checkForError()
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

export const getStore = async (keys: string[] | null = null) => {
  const result = await _get(keys)
  // extension.storage.local always returns an obj
  // if the object is empty, treat it as undefined
  if (isEmpty(result)) {
    return undefined
  }
  return result
}

export const removeFromStore = async (keys: string[] | null = null) => {
  const result = await _remove(keys)

  return result
}

export const setAll = async (state: { [key: string]: any }) => {
  const result = await _setAll(state)

  return result
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _set = async (key: string, value: any) => {
  const { local } = browserAPI.storage
  const store = await getStore()

  return new Promise((resolve, reject) => {
    local.set({ store, [key]: value }).then(() => {
      const err = checkForError()
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export const setItem = async (key: string, value: any) => {
  const result = await _set(key, value)

  return result
}
