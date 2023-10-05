import { relayerCall } from '@ambire-common/libs/relayerCall/relayerCall'
import { RELAYER_URL } from '@env'

const callRelayer = relayerCall.bind({ url: RELAYER_URL, fetch })

const useRelayerData = (props: Parameters<typeof callRelayer>[0]) => callRelayer(props)

export default useRelayerData
