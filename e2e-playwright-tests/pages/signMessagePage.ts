import { bootstrapWithStorage } from 'common-helpers/bootstrap'
import { BasePage } from './basePage'

export class SignMessagePage extends BasePage {
  async init(param) {
    const { page } = await bootstrapWithStorage('signMessage', param)
    this.page = page
  }
}
