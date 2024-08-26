const getBenzinUrlParams = ({
  chainId,
  txnId,
  userOpHash,
  relayerId,
  isInternal
}: {
  chainId?: string | number | bigint
  txnId?: string | null
  userOpHash?: string | null
  relayerId?: string | null
  isInternal?: boolean
}): string => {
  return `?chainId=${String(chainId)}${txnId ? `&txnId=${txnId}` : ''}${
    userOpHash ? `&userOpHash=${userOpHash}` : ''
  }${relayerId ? `&relayerId=${relayerId}` : ''}${isInternal ? '&isInternal' : ''}`
}

export { getBenzinUrlParams }
