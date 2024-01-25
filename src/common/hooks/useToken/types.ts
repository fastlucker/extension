import { Token } from '@ambire-common-v1/hooks/usePortfolio'

export type UseTokenReturnType = {
  getTokenDetails: (tokenAddress: string) => Promise<Token | null>
}
