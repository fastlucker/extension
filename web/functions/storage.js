/* eslint-disable import/no-mutable-exports */
import { browserAPI } from '../constants/browserAPI.js'

// Storage
// which tabs are injected tabId => true
export let TAB_INJECTIONS = {}
// permissions host => true/false
export let PERMISSIONS = {}
// pending notifications asking for user attention (sign / send tx)
export let USER_ACTION_NOTIFICATIONS = {}

export const setTabInjections = (tabInjections) => {
  TAB_INJECTIONS = tabInjections
}

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
      ['TAB_INJECTIONS', 'PERMISSIONS', 'USER_ACTION_NOTIFICATIONS', 'NETWORK', 'SELECTED_ACCOUNT'],
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

// like [].filter but for objects
function filterObject(obj, callback) {
  return Object.fromEntries(Object.entries(obj).filter(([key, val]) => callback(val, key)))
}

// save tab injections in local storage
export const saveTabInjectionsInStorage = () => {
  isStorageLoaded().then(() => {
    browserAPI.storage.local.set({ TAB_INJECTIONS: filterObject(TAB_INJECTIONS, (k, v) => v) })
  })
}

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
const _get = async (keys = null) => {
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

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

/**
 * Returns all of the keys currently saved
 *
 * @returns {Promise<*>}
 */
export const getStore = async (keys = null) => {
  // TODO:
  // if (!isSupported) {
  //   return undefined
  // }
  const result = await _get(keys)
  // extension.storage.local always returns an obj
  // if the object is empty, treat it as undefined
  if (isEmpty(result)) {
    return undefined
  }
  return result
}
