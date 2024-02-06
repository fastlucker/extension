import { AddressState } from '@ambire-common/interfaces/domains'

const getAddressFromAddressState = (addressState: AddressState) => {
  return (addressState.udAddress || addressState.ensAddress || addressState.fieldValue || '').trim()
}

export { getAddressFromAddressState }
