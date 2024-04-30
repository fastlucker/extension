import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { storage } from '@web/extension-services/background/webapi/storage'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum INVITE_STATUS {
  UNCHECKED = 'UNCHECKED',
  VERIFIED = 'VERIFIED'
}

export class InviteController extends EventEmitter {
  inviteStatus: INVITE_STATUS = INVITE_STATUS.UNCHECKED

  constructor() {
    super()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#init()
  }

  async #init() {
    this.inviteStatus = await storage.get('inviteStatus', INVITE_STATUS.UNCHECKED)
  }
}
