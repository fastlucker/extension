import { FC } from 'react'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import shortenAddress from '@web/utils/shortenAddress'

interface Props {
  maxLength: number
  address: string
  style?: any
  hideParentheses?: boolean
}

const PlainAddress: FC<Props> = ({ style, maxLength, address, hideParentheses }) => (
  <Text fontSize={12} appearance="secondaryText" style={[spacings.mrMi, style]}>
    {hideParentheses ? '' : '('}
    {shortenAddress(address, maxLength)}
    {hideParentheses ? '' : ')'}
  </Text>
)

export default PlainAddress
