/* eslint-disable import/no-mutable-exports */
import { browserAPI } from '../constants/browserAPI.js'
import { VERBOSE } from '../constants/env.js'

// Storage
// which tabs are injected tabId => true
export let TAB_INJECTIONS = {}
// permissions host => true/false
export let PERMISSIONS = {}
// pending notifications asking for user attention (sign / send tx)
export let USER_ACTION_NOTIFICATIONS = {}
export let NETWORK = {}
export let SELECTED_ACCOUNT = ''

export const setTabInjections = (tabInjections) => {
  TAB_INJECTIONS = tabInjections
}

export const setPermissions = (permissions) => {
  PERMISSIONS = permissions
}

export const setUserActionNotifications = (userActionNotifications) => {
  USER_ACTION_NOTIFICATIONS = userActionNotifications
}

export const setNetwork = (network) => {
  NETWORK = network
}

export const setSelectedAccount = (selectedAccount) => {
  SELECTED_ACCOUNT = selectedAccount
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
        NETWORK = { ...NETWORK, ...result.NETWORK }
        SELECTED_ACCOUNT = result.SELECTED_ACCOUNT || SELECTED_ACCOUNT
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
    if (VERBOSE > 4) console.debug('saving user action notifications', USER_ACTION_NOTIFICATIONS)
    browserAPI.storage.local.set({ USER_ACTION_NOTIFICATIONS }, cb)
  })
}
