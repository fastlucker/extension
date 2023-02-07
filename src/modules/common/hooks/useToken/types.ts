import { Token } from 'ambire-common/src/hooks/usePortfolio'

import { MODES } from '@modules/dashboard/components/AddOrHideToken/constants'

export type UseTokenReturnType = {
  getTokenDetails: (
    tokenAddress: string,
    checkIfAlreadyHandledAgainst: MODES
  ) => Promise<Token | null>
}
