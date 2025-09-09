import { getAddress } from 'ethers'
import React, { FC, useEffect } from 'react'

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

  useEffect(() => {
    if (!contractNames[address]?.name && !loadingAddresses.some((l) => l.address === address))
      dispatch({
        type: 'CONTRACT_NAMES_CONTROLLER_GET_NAME',
        params: {
          address: getAddress(address),
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
      {ens || contractNames[address]?.name || address}
    </BaseAddress>
  )
}

export default AddressName
