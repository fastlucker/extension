import Events from 'events'

export class Web3Controller extends Events {
  constructor() {
    setTimeout(() => {
      this.emit('resolve', {
        sup: 'yep'
      })
    }, 5000)
  }
}
