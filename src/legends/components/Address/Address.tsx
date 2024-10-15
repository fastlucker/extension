import React, { FC } from 'react'

import shortenAddress from '@ambire-common/utils/shortenAddress'
import useStandaloneReverseLookup from '@common/hooks/useStandaloneReverseLookup'

import styles from './Address.module.scss'

type Props = {
  address: string
  maxAddressLength?: number
  skeletonClassName?: string
  className?: string
}

const Address: FC<Props> = ({ address, className, skeletonClassName, maxAddressLength }) => {
  const { isLoading, resolvedDomain } = useStandaloneReverseLookup({
    address
  })
  const shortenedAddress = maxAddressLength ? shortenAddress(address, maxAddressLength) : address

  if (isLoading) {
    return <div className={`${styles.skeleton} ${className} ${skeletonClassName}`} />
  }

  return (
    <span className={`${styles.address} ${className}`}>
      {resolvedDomain.ens || resolvedDomain.ud || shortenedAddress}
    </span>
  )
}

export default Address
