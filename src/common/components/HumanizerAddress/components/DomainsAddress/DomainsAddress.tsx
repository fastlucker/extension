import React, { FC } from 'react'

import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useReverseLookup from '@common/hooks/useReverseLookup'

import BaseAddress from '../BaseAddress'

interface Props extends TextProps {
  address: string
}

const DomainsAddress: FC<Props> = ({ address, ...rest }) => {
  const { ens, isLoading } = useReverseLookup({ address })

  if (isLoading)
    return (
      <Spinner
        style={{
          width: 16,
          height: 16
        }}
      />
    )

  return (
    <BaseAddress address={address} {...rest}>
      {ens || address}
    </BaseAddress>
  )
}

export default DomainsAddress
