import { Block } from 'ethers'

import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'

const getDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12'
  })
}

const shouldShowTxnProgress = (finalizedStatus: FinalizedStatusType) => {
  if (!finalizedStatus) return true

  const doNotShow = ['dropped']
  return doNotShow.indexOf(finalizedStatus.status) === -1
}

const getTimestamp = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return getDate(blockData.timestamp)
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

const getBlockNumber = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return blockData.number.toString()
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

const getFinalizedRows = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  const rows = [
    {
      label: 'Timestamp',
      value: getTimestamp(blockData, finalizedStatus)
    },
    {
      label: 'Block number',
      value: getBlockNumber(blockData, finalizedStatus)
    }
  ]

  if (finalizedStatus?.reason) {
    rows.unshift({
      label: 'Failed reason',
      value: finalizedStatus.reason
    })
  }

  return rows
}

const getFee = (
  cost: null | string,
  network: NetworkDescriptor,
  nativePrice: number,
  finalizedStatus: FinalizedStatusType
) => {
  if (cost) {
    return `${cost} ${network.nativeAssetSymbol} ($${(Number(cost) * nativePrice).toFixed(2)})`
  }

  return finalizedStatus && finalizedStatus.status === 'dropped' ? '-' : 'Fetching...'
}

export { shouldShowTxnProgress, getTimestamp, getBlockNumber, getFinalizedRows, getFee }
