import commonUseRelayerData from 'ambire-common/src/hooks/useRelayerData'

export interface UseRelayerDataReturnType {
  data: any
  isLoading: boolean
  errMsg: string | null
  forceRefresh: () => void
}

export default function useRelayerData(
  url: string | null,
  initialState: any
): UseRelayerDataReturnType {
  const {
    data,
    isLoading,
    errMsg: err,
    forceRefresh
  } = commonUseRelayerData(fetch, url, initialState)

  return { data, isLoading, errMsg: err, forceRefresh }
}
