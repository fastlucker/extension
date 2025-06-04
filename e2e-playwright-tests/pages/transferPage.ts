import { bootstrapWithStorage } from '../common-helpers/bootstrap'
import { BasePage } from './basePage'

export class TransferPage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('transfer', param)
    this.page = page
  }
}
