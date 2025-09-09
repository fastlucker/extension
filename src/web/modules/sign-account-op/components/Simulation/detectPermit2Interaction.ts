import { dataSlice, getAddress } from 'ethers'

export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3'.toLowerCase()

const PERMIT2_SELECTORS = new Set([
  // Permit approvals
  '0xd505accf', // permit (single)
  '0x8fcbaf0c', // permit (batch)

  // Permit + transfer
  '0x2d6ef310', // permitTransferFrom (single)
  '0x6e1a6f91', // permitTransferFrom (batch)

  // Allowance transfers
  '0xf664fbb0', // transferFrom
  '0x36c78516', // transferFromBatch

  // Allowance management
  '0x095ea7b3', // approve (same as ERC-20 approve)
  '0xdede965d', // lockdown(token, spender)
  '0x9d075186', // lockdown(token)
  '0xf56f096c', // lockdownAll

  // Nonces / utilities
  '0x620fe9d7', // invalidateNonces
  '0x4d6a8a18', // invalidateUnorderedNonces
  '0x3644e515' // DOMAIN_SEPARATOR
])

/**
 * Extract spender if call is `approve(address spender, uint amount)`
 */
function extractSpenderFromApprove(data: string): string | null {
  if (!data || !data.startsWith('0x095ea7b3')) return null
  try {
    const slot = dataSlice(data, 4, 36) // 32-byte slot for spender
    const spenderHex = `0x${slot.slice(-40)}` // keep last 20 bytes
    return getAddress(spenderHex)
  } catch {
    return null
  }
}

/**
 * Detects if a call is interacting with Permit2
 */
export function isPermit2Interaction(call: { to: string; data: string }): {
  isPermit2: boolean
  type: 'direct' | 'approve-indirect' | null
  selector?: string
  spender?: string
} {
  if (!call?.to || !call?.data) return { isPermit2: false, type: null }

  const selector = call.data.slice(0, 10).toLowerCase()

  // Case 1: direct call to Permit2
  if (call.to.toLowerCase() === PERMIT2_ADDRESS) {
    if (PERMIT2_SELECTORS.has(selector)) {
      return { isPermit2: true, type: 'direct', selector }
    }
    return { isPermit2: true, type: 'direct', selector }
  }

  // Case 2: approve on ERC-20 where spender is Permit2
  if (selector === '0x095ea7b3') {
    const spender = extractSpenderFromApprove(call.data)
    if (spender?.toLowerCase() === PERMIT2_ADDRESS) {
      return { isPermit2: true, type: 'approve-indirect', selector, spender }
    }
  }

  return { isPermit2: false, type: null }
}
