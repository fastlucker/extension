import commonUseRelayerData from 'ambire-common/src/hooks/useRelayerData'
import { UseRelayerDataProps } from 'ambire-common/src/hooks/useRelayerData/types'

const useRelayerData = (props: Omit<UseRelayerDataProps, 'fetch'>) =>
  commonUseRelayerData({ fetch, ...props })

export default useRelayerData
