import { relayerCall } from 'ambire-common/src/libs/relayerCall/relayerCall'

import { RELAYER_URL } from '@env'

const callRelayer = relayerCall.bind({ url: RELAYER_URL, fetch })

const useRelayerData = (props: any) => callRelayer(props)

export default useRelayerData
