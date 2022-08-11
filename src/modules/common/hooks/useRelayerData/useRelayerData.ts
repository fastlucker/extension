import commonUseRelayerData from 'ambire-common/src/hooks/useRelayerData'

export interface UseRelayerDataReturnType {
  data: any
  isLoading: boolean
  errMsg: string | null
  forceRefresh: () => void
}

const useRelayerData = (url: string | null, initialState: any) =>
  commonUseRelayerData(fetch, url, initialState)

export default useRelayerData
