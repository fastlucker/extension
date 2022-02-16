import { formatUnits } from 'ethers/lib/utils'
// TODO: add types
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

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
          <Text>{getTransactionSummary(txn, network, account, { mined })}</Text>
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
            <Text fontSize={13}>{txn[0]}</Text>
            <Text fontSize={13}>{contractName ? ` (${contractName})` : ''}</Text>
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
