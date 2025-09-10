import React, { FC, useEffect, useMemo } from 'react'

import { isUnderstandableName } from '@ambire-common/utils/contractNames'
import Spinner from '@common/components/Spinner'
import { Props as TextProps } from '@common/components/Text'
import useReverseLookup from '@common/hooks/useReverseLookup'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useContractNamesControllerState from '@web/hooks/useContractNamesController/useContractNamesController'

import BaseAddress from '../BaseAddress'

interface Props extends TextProps {
  address: string
  chainId: bigint
}

const AddressName: FC<Props> = ({ address, chainId, ...rest }) => {
  const { ens, isLoading } = useReverseLookup({ address })
  const { contractNames, loadingAddresses } = useContractNamesControllerState()
  const { dispatch } = useBackgroundService()
  const foundContractName = useMemo(() => {
    const name = contractNames?.[address]?.name
    if (!name) return
    if (isUnderstandableName(name)) return name
    return undefined
  }, [contractNames, address])

  useEffect(() => {
    if (
      !contractNames[address]?.name &&
      !loadingAddresses.some((l) => l.address.toLowerCase() === address.toLowerCase())
    )
      dispatch({
        type: 'CONTRACT_NAMES_CONTROLLER_GET_NAME',
        params: {
          address,
          chainId
        }
      })
  }, [dispatch, address, chainId, contractNames, loadingAddresses])
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
      {ens || foundContractName || address}
    </BaseAddress>
  )
}

export default AddressName
