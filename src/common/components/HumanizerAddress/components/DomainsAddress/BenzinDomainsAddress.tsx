/* eslint-disable no-console */
import React, { FC } from 'react'

import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useStandaloneReverseLookup from '@common/hooks/useStandaloneReverseLookup'

import BaseAddress from '../BaseAddress'

interface Props extends TextProps {
  address: string
}

const BenzinDomainsAddress: FC<Props> = ({ address, ...rest }) => {
  const { isLoading, resolvedDomain } = useStandaloneReverseLookup({ address })

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
      {resolvedDomain.ens || resolvedDomain.ud || address}
    </BaseAddress>
  )
}

export default BenzinDomainsAddress
