import {
  AccountOpIdentifiedBy,
  getFetchedUserOpHash,
  getRelayerId,
  isIdentifiedByRelayer,
  isIdentifiedByUserOpHash
} from '@ambire-common/libs/accountOp/submittedAccountOp'

const getBenzinUrlParams = ({
  chainId,
  txnId,
  identifiedBy,
  isInternal
}: {
  chainId?: string | number | bigint
  txnId?: string | null
  identifiedBy?: AccountOpIdentifiedBy
  isInternal?: boolean
}): string => {
  const userOpHash =
    identifiedBy && isIdentifiedByUserOpHash(identifiedBy)
      ? getFetchedUserOpHash(identifiedBy)
      : undefined

  const relayerId =
    identifiedBy && isIdentifiedByRelayer(identifiedBy) ? getRelayerId(identifiedBy) : undefined

  return `?chainId=${String(chainId)}${txnId ? `&txnId=${txnId}` : ''}${
    userOpHash ? `&userOpHash=${userOpHash}` : ''
  }${relayerId ? `&relayerId=${relayerId}` : ''}${isInternal ? '&isInternal' : ''}`
}

export { getBenzinUrlParams }
