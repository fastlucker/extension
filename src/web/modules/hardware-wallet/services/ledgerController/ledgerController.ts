import HDKey from 'hdkey'

import LedgerEth from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'

interface Account {
  address: string
  balance: number | null
  index: number
}

class LedgerController {
  page: number

  perPage: number

  hdk: any

  hasHIDPermission: null | boolean

  transport: null | Transport

  app: null | LedgerEth

  constructor() {
    this.page = 0
    this.perPage = 5
    this.hdk = new HDKey()
    this.hasHIDPermission = null
    this.transport = null
    this.app = null
  }

  isUnlocked() {
    return Boolean(this.hdk && this.hdk.publicKey)
  }

  async makeApp() {
    if (!this.app) {
      try {
        this.transport = await TransportWebHID.create()
        this.app = new LedgerEth(this.transport as Transport)
      } catch (e: any) {
        // Silent fail
      }
    }
  }

  async unlock(hdPath?, force?: boolean): Promise<string> {
    if (force) {
      hdPath = this.hdPath
    }
    if (this.isUnlocked() && !hdPath) {
      return 'already unlocked'
    }
    const path = hdPath ? this._toLedgerPath(hdPath) : this.hdPath
    if (this.isWebHID) {
      await this.makeApp()
      const res = await this.app!.getAddress(path, false, true)
      const { address, publicKey, chainCode } = res
      this.hdk.publicKey = Buffer.from(publicKey, 'hex')
      this.hdk.chainCode = Buffer.from(chainCode!, 'hex')

      return address
    }
    return new Promise((resolve, reject) => {
      this._sendMessage(
        {
          action: 'ledger-unlock',
          params: {
            hdPath: path
          }
        },
        ({ success, payload }) => {
          if (success) {
            this.hdk.publicKey = Buffer.from(payload.publicKey, 'hex')
            this.hdk.chainCode = Buffer.from(payload.chainCode, 'hex')
            resolve(payload.address)
          } else {
            reject(payload.error || 'Unknown error')
          }
        }
      )
    })
  }

  authorizeHIDPermission() {
    this.hasHIDPermission = true
  }

  getFirstPage() {
    this.page = 0
    return this.__getPage(1)
  }

  getNextPage() {
    return this.__getPage(1)
  }

  getPreviousPage() {
    return this.__getPage(-1)
  }

  async __getPage(increment: number) {
    this.page += increment

    if (this.page <= 0) {
      this.page = 1
    }
    const from = (this.page - 1) * this.perPage
    const to = from + this.perPage

    await this.makeApp()

    const accounts: Account[] = await this._getAccountsBIP44(from, to)

    return accounts
  }

  async _getAccountsBIP44(from: number, to: number) {
    const accounts: Account[] = []

    for (let i = from; i < to; i++) {
      const path = this._getPathForIndex(i)
      const address = await this.unlock(path)
      // TODO:
      // const valid = this.implementFullBIP44 ? await this._hasPreviousTransactions(address) : true
      accounts.push({
        address,
        balance: null,
        index: i + 1
      })
      // TODO:
      // PER BIP44
      // "Software should prevent a creation of an account if
      // a previous account does not have a transaction history
      // (meaning none of its addresses have been used before)."
      // if (!valid) {
      //   break
      // }
    }
    return accounts
  }

  _getPathForIndex(index: number) {
    return `m/44'/60'/${index}'/0/0`
  }
}

export default LedgerController
