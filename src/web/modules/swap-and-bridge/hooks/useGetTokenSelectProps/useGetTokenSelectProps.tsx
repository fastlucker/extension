import React from 'react'

import { Network } from '@ambire-common/interfaces/network'
import { TokenResult } from '@ambire-common/libs/portfolio'
import Text from '@common/components/Text'
import { mapTokenOptions } from '@web/utils/maps'

const NO_TOKENS_ITEMS = [
  {
    value: 'noTokens',
    label: (
      <Text weight="medium" fontSize={14}>
        You don&apos;t have any tokens
      </Text>
    ),
    icon: null
  }
]

const useGetTokenSelectProps = ({
  tokens,
  token,
  networks,
  skipNetwork
}: {
  tokens: TokenResult[]
  token: string
  networks: Network[]
  skipNetwork?: boolean
}) => {
  let options: any = []
  let value = null
  let amountSelectDisabled = true

  if (tokens?.length === 0) {
    value = NO_TOKENS_ITEMS[0]
    options = NO_TOKENS_ITEMS
  } else {
    options = mapTokenOptions(tokens, networks, skipNetwork)
    value = options.find((item: any) => item.value === token) || options[0]
    amountSelectDisabled = false
  }

  return {
    options,
    value,
    amountSelectDisabled
  }
}

export default useGetTokenSelectProps
