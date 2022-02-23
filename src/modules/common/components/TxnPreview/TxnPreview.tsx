import { formatUnits } from 'ethers/lib/utils'
// TODO: add types
import React, { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import networks from '@modules/common/constants/networks'
import { getName, isKnown } from '@modules/common/services/humanReadableTransactions'
import { getTransactionSummary } from '@modules/common/services/humanReadableTransactions/transactionSummary'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import Text, { TEXT_TYPES } from '../Text'
import styles from './styles'

function getNetworkSymbol(networkId: any) {
  const network = networks.find((x) => x.id === networkId)
  return network ? network.nativeAssetSymbol : 'UNKNW'
}

const zapperStorageTokenIcons = 'https://storage.googleapis.com/zapper-fi-assets/tokens'

function getTokenIcon(network: any, address: any) {
  return `${zapperStorageTokenIcons}/${network}/${address}.png`
}

function parseExtendedSummaryItem(item: any, i: any, networkDetails: any) {
  if (item === '') return null

  if (item.length === 1) return <Text>{`${item} `}</Text>

  if (i === 0) return <Text key={`item-${i}`}>{`${item} `}</Text>

  if (!item.type) return <Text key={`item-${i}`}>{`${item} `}</Text>

  if (item.type === 'token')
    return (
      <>
        {item.amount > 0 ? <Text>{`${item.amount} `}</Text> : null}
        {item.address ? (
          <Image
            source={{ uri: getTokenIcon(networkDetails.id, item.address) }}
            style={{ width: 24, height: 24 }}
          />
        ) : null}
        <Text> </Text>
        <Text>{`${item.symbol} `}</Text>
      </>
    )

  if (item.type === 'address') return <Text>{`${item.name ? item.name : item.address} `}</Text>

  if (item.type === 'network')
    return (
      <Text key={`item-${i}`}>
        {item.icon ? <Image source={{ uri: item.icon }} style={{ width: 20, height: 20 }} /> : null}
        {` ${item.name} `}
      </Text>
    )

  if (item.type === 'erc721') {
    return <Text>{` ${item.name} `}</Text>
  }

  return null
}

const TxnPreview = ({
  txn,
  onDismiss,
  network,
  account,
  isFirstFailing,
  mined,
  disableExpand
}: any) => {
  const [isExpanded, setExpanded] = useState(false)
  const contractName = getName(txn[0], network)

  const networkDetails = networks.find(({ id }) => id === network)

  const extendedSummary = getTransactionSummary(txn, network, account, { mined, extended: true })

  const summary = extendedSummary.map((entry: any) =>
    Array.isArray(entry) ? (
      entry.map((item, i) => parseExtendedSummaryItem(item, i, networkDetails))
    ) : (
      <Text>{entry}</Text>
    )
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => !disableExpand && setExpanded((e) => !e)}
        style={styles.listItem}
        activeOpacity={0.75}
      >
        {!disableExpand && (
          <MaterialIcons
            style={spacings.mrTy}
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={26}
            color={colors.primaryIconColor}
          />
        )}
        <View style={[flexboxStyles.flex1, spacings.mrTy]}>
          <View
            style={[
              flexboxStyles.directionRow,
              flexboxStyles.wrap,
              flexboxStyles.flex1,
              flexboxStyles.alignCenter
            ]}
          >
            {summary}
          </View>
          {isFirstFailing && (
            <Text type={TEXT_TYPES.DANGER} style={[spacings.ptTy, textStyles.bold]}>
              This is the first failing transaction.
            </Text>
          )}
          {!isFirstFailing && !mined && !isKnown(txn, account) && (
            <Text type={TEXT_TYPES.DANGER} style={[spacings.ptTy, textStyles.bold]}>
              Warning: interacting with an unknown contract or address.
            </Text>
          )}
        </View>
        {!!onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <MaterialIcons name="close" size={26} color={colors.primaryIconColor} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isExpanded ? (
        <View style={styles.expandedContainer}>
          <View style={spacings.mbTy}>
            <Text fontSize={13} style={textStyles.bold}>
              Interacting with (to):
            </Text>
            <Text fontSize={13}>
              {txn[0]}
              <Text fontSize={13}>{contractName ? ` (${contractName})` : ''}</Text>
            </Text>
          </View>
          <View style={spacings.mbTy}>
            <Text>
              <Text>
                <Text fontSize={13}>{`${getNetworkSymbol(network)} `}</Text>
                <Text fontSize={13}>{'to be sent value '}</Text>
              </Text>
              <Text fontSize={13}>{formatUnits(txn[1] || '0x0', 18)}</Text>
            </Text>
          </View>
          <View>
            <Text fontSize={13}>Data:</Text>
            <Text fontSize={13}>{txn[2]}</Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export default TxnPreview
