import EventEmitter from '@ambire-common/controllers/eventEmitter/eventEmitter'
import { storage } from '@web/extension-services/background/webapi/storage'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum INVITE_STATUS {
  UNCHECKED = 'UNCHECKED',
  VERIFIED = 'VERIFIED'
}

type Invite = {
  status: INVITE_STATUS
  verifiedAt: null | number // timestamp
}

export class InviteController extends EventEmitter {
  inviteStatus: Invite['status'] = INVITE_STATUS.UNCHECKED

  constructor() {
    super()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.#init()
  }

  async #init() {
    const invite = await storage.get('invite', {
      status: INVITE_STATUS.UNCHECKED,
      verifiedAt: null
    })

    this.inviteStatus = invite.status
    this.emitUpdate()
  }

  verify(code: string) {
    // TODO: Verify invite code against the Relayer
    this.inviteStatus = INVITE_STATUS.VERIFIED
    this.emitUpdate()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    storage.set('invite', {
      status: INVITE_STATUS.VERIFIED,
      verifiedAt: Date.now()
    })
  }
}
