import commonUseRelayerData, { UseRelayerDataProps } from 'ambire-common/src/hooks/useRelayerData'

const useRelayerData = (props: Omit<UseRelayerDataProps, 'fetch'>) =>
  commonUseRelayerData({ fetch, ...props })

export default useRelayerData
