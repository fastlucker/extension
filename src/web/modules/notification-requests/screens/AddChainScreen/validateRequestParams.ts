const validateRequestParams = (method: string, params: { [key: string]: any }) => {
  if (!['wallet_addEthereumChain'].includes(method)) return false

  if (!params) {
    return false
  }

  if (
    !params?.chainId ||
    !params?.rpcUrls ||
    !params?.chainName ||
    !params?.nativeCurrency?.symbol
  ) {
    return false
  }

  try {
    if (!Number(params?.chainId)) return false
  } catch (error) {
    return false
  }

  return true
}

export default validateRequestParams
