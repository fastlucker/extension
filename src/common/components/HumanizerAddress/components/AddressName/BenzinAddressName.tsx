/* eslint-disable no-console */
import React, { FC, useEffect, useMemo } from 'react'

import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useContractNamesContext from '@common/hooks/useContractNamesContext/useContractNamesContext'
import useStandaloneReverseLookup from '@common/hooks/useStandaloneReverseLookup'

import BaseAddress from '../BaseAddress'

interface Props extends TextProps {
  address: string
  chainId: bigint
}

const BenzinAddressNames: FC<Props> = ({ address, chainId, ...rest }) => {
  const { isLoading: isLoadingEns, resolvedDomain } = useStandaloneReverseLookup({ address })
  const { contractNamesCtrl, state } = useContractNamesContext()

  useEffect(() => {
    if (!contractNamesCtrl.contractNames?.[address]) contractNamesCtrl.getName(address, chainId)
  }, [address, chainId, contractNamesCtrl])

  const foundContractName = useMemo(() => {
    const name = state.contractNames?.[address]?.name
    if (!name) return
    const forbiddenWords = ['Ambire', 'Identity', 'Safe', 'Proxy']
    if (forbiddenWords.some((fw) => name.toLowerCase().includes(fw.toLowerCase()))) return
    return name
  }, [state, address])

  if (isLoadingEns)
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
      {resolvedDomain.ens || foundContractName || address}
    </BaseAddress>
  )
}

export default BenzinAddressNames
