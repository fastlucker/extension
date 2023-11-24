import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'

const handleErrors = (error: any) => {
  if (typeof error === 'boolean') return error
  if (typeof error?.message === 'string') return error?.message
  if (!error) return false
}

const getAreDefaultsChanged = (values: any, selectedNetwork?: NetworkDescriptor) => {
  if (!selectedNetwork) {
    return false
  }

  return Object.keys(values).some((key) => {
    if (key === 'chainId') {
      return values[key] !== Number(selectedNetwork[key])
    }
    return key in selectedNetwork && values[key] !== selectedNetwork[key as keyof NetworkDescriptor]
  })
}

export { handleErrors, getAreDefaultsChanged }
