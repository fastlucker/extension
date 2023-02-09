import { Token } from 'ambire-common/src/hooks/usePortfolio'

export type UseTokenReturnType = {
  getTokenDetails: (tokenAddress: string) => Promise<Token | null>
}
