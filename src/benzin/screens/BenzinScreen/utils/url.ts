const getBenzinUrlParams = ({
  chainId,
  txnId,
  userOpHash,
  isInternal
}: {
  chainId?: string | number | bigint
  txnId?: string | null
  userOpHash?: string | null
  isInternal?: boolean
}): string => {
  return `?chainId=${String(chainId)}${txnId ? `&txnId=${txnId}` : ''}${
    userOpHash ? `&userOpHash=${userOpHash}` : ''
  }${isInternal ? '&isInternal' : ''}`
}

export { getBenzinUrlParams }
