import { names, tokens } from '@modules/common/constants/humanizerInfo.json'
import networks from '@modules/common/constants/networks'
import humanizers from '@modules/common/services/humanizers'

import { nativeToken } from './humanReadableTransactions'

// This function is moved away from the `humanReadableTransactions` main file,
// because the `humanizers` import is causing a require cycle between
//   1) humanReadableTransactions/index.ts ->
//   2) humanizers/index.ts ->
//   3) humanizers/YearnVault.ts (and all others) ->
//   4) humanReadableTransactions/index.ts
export function getTransactionSummary(txn: any, networkId: any, accountAddr: any, opts = {}) {
  const [to, value, data = '0x'] = txn
  const network = networks.find((x) => x.id === networkId || x.chainId === networkId)
  if (!network) return 'Unknown network (unable to parse)'

  if (to === '0x' || !to) {
    return 'Deploy contract'
  }

  const tokenInfo = tokens[to.toLowerCase()]
  const name = names[to.toLowerCase()]

  if (data === '0x' && to.toLowerCase() === accountAddr.toLowerCase()) {
    // Doesn't matter what the value is, this is always a no-op
    return 'Transaction cancellation'
  }

  let callSummary
  let sendSummary
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (parseInt(value) > 0) sendSummary = `send ${nativeToken(network, value)} to ${name || to}`
  if (data !== '0x') {
    callSummary = `Unknown interaction with ${name || (tokenInfo ? tokenInfo[0] : to)}`

    const sigHash = data.slice(0, 10)
    const humanizer = humanizers[sigHash]
    if (humanizer) {
      try {
        const actions = humanizer({ to, value, data, from: accountAddr }, network, opts)
        return actions.join(', ')
      } catch (e) {
        callSummary += ' (unable to parse)'
        console.error('internal tx humanization error', e)
      }
    }
  }
  return [callSummary, sendSummary].filter((x) => x).join(', ')
}
