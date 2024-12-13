import { Block } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import { FinalizedStatusType } from '@benzin/screens/BenzinScreen/interfaces/steps'

const doNotShow = ['dropped', 'rejected']

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

  return doNotShow.indexOf(finalizedStatus.status) === -1
}

const getTimestamp = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return getDate(blockData.timestamp)
  }

  return finalizedStatus && doNotShow.indexOf(finalizedStatus.status) !== -1 ? '-' : 'loading'
}

const getBlockNumber = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  if (blockData) {
    return blockData.number.toString()
  }

  return finalizedStatus && doNotShow.indexOf(finalizedStatus.status) !== -1 ? '-' : 'loading'
}

const getFinalizedRows = (blockData: null | Block, finalizedStatus: FinalizedStatusType) => {
  const rows: {
    label: string
    value: string
    error?: true
  }[] = [
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
      value: finalizedStatus.reason,
      error: true
    })
  }

  return rows
}

const getFee = (
  cost: null | string,
  network: Network,
  nativePrice: number,
  finalizedStatus: FinalizedStatusType
) => {
  if (cost) {
    return `${formatDecimals(Number(cost), 'amount')} ${
      network.nativeAssetSymbol
    } (${formatDecimals(Number(cost) * nativePrice, 'price')})`
  }

  return finalizedStatus && doNotShow.indexOf(finalizedStatus.status) !== -1 ? '-' : 'loading'
}

export { shouldShowTxnProgress, getTimestamp, getBlockNumber, getFinalizedRows, getFee }
