import commonUseRelayerData, { UseRelayerDataProps } from 'ambire-common/v1/hooks/useRelayerData'

const useRelayerData = (props: Omit<UseRelayerDataProps, 'fetch'>) =>
  commonUseRelayerData({ fetch, ...props })

export default useRelayerData
