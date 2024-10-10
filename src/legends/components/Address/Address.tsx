import React, { FC } from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import useStandaloneReverseLookup from '@common/hooks/useStandaloneReverseLookup'

import styles from './Address.module.scss'

type Props = {
  address: string
  maxAddressLength?: number
  className?: string
}

const Address: FC<Props> = ({ address, className, maxAddressLength }) => {
  const { isLoading, resolvedDomain } = useStandaloneReverseLookup({
    address
  })
  const shortenedAddress = maxAddressLength ? shortenAddress(address, maxAddressLength) : address

  if (isLoading) {
    return (
      <div
        className={`${styles.skeleton} ${className}`}
        style={{
          width: maxAddressLength ? `${maxAddressLength}ch` : 'auto'
        }}
      />
    )
  }

  return (
    <span className={`${styles.address} ${className}`}>
      {resolvedDomain.ens || resolvedDomain.ud || shortenedAddress}
    </span>
  )
}

export default Address
