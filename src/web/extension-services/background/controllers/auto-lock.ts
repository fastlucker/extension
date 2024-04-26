import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { isManifestV3 } from '@web/constants/browserapi'
import { storage } from '@web/extension-services/background/webapi/storage'

export const ALARMS_AUTO_LOCK = 'ALARMS_AUTO_LOCK'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum AUTO_LOCK_TIMES {
  never = 0, // never
  _7days = 10080, // 7 days in minutes
  _1day = 1440, // 1 day in minutes
  _4hours = 240, // 4 hours in minutes
  _1hour = 60, // 1 hour in minutes
  _10minutes = 10 // 10 minutes
}

export class AutoLockController extends EventEmitter {
  isReady: boolean = false

  timer: ReturnType<typeof setTimeout> | null = null

  #_autoLockTime: AUTO_LOCK_TIMES = 0 // number in ms

  get autoLockTime() {
    return this.#_autoLockTime
  }

  set autoLockTime(newValue: AUTO_LOCK_TIMES) {
    this.#_autoLockTime = newValue
    storage.set('autoLockTime', newValue)
    this.emitUpdate()
  }

  #onAutoLock: () => void

  constructor(onAutoLock: () => void) {
    super()
    this.#onAutoLock = onAutoLock
    this.#init()
  }

  async #init(): Promise<void> {
    this.#_autoLockTime = await storage.get('autoLockTime', 0)

    this.isReady = true
    this.emitUpdate()
  }

  #resetTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
    } else if (isManifestV3) {
      browser.alarms.clear(ALARMS_AUTO_LOCK)
    }
    if (!this.autoLockTime) return

    if (isManifestV3) {
      browser.alarms.create(ALARMS_AUTO_LOCK, {
        delayInMinutes: this.autoLockTime,
        periodInMinutes: this.autoLockTime
      })
      browser.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === ALARMS_AUTO_LOCK) {
          this.#onAutoLock()
          browser.alarms.clear(ALARMS_AUTO_LOCK)
        }
      })
    } else {
      this.timer = setTimeout(() => {
        if (this.autoLockTime) this.#onAutoLock()
      }, this.autoLockTime * 60 * 1000)
    }
  }

  setLastActiveTime() {
    this.#resetTimer()
  }

  toJSON() {
    return {
      ...this,
      ...super.toJSON(),
      autoLockTime: this.autoLockTime
    }
  }
}

export default AutoLockController
