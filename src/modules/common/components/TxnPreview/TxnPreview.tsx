import { formatUnits } from 'ethers/lib/utils'
// TODO: add types
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import networks from '@modules/common/constants/networks'
import { getName, isKnown } from '@modules/common/services/humanReadableTransactions'
import { getTransactionSummary } from '@modules/common/services/humanReadableTransactions/transactionSummary'

import Text from '../Text'

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
    <View style={{ padding: 10 }}>
      <TouchableOpacity
        onPress={() => !disableExpand && setExpanded((e) => !e)}
        style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <View>
          <Text>{getTransactionSummary(txn, network, account, { mined })}</Text>
          {isFirstFailing && <Text>This is the first failing transaction.</Text>}
          {!isFirstFailing && !mined && !isKnown(txn, account) && (
            <Text>Warning: interacting with an unknown contract or address.</Text>
          )}
        </View>
        {!!onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <Text>❌</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isExpanded ? (
        <View>
          <View>
            <Text>Interacting with (to):</Text>
            <Text>
              <Text>{txn[0]}</Text>
              <Text>{contractName ? ` (${contractName})` : ''}</Text>
            </Text>
          </View>
          <View>
            <Text>
              <Text>
                {`${getNetworkSymbol(network)} `}
                <Text>{'to be sent value '}</Text>
              </Text>
              <Text>{formatUnits(txn[1] || '0x0', 18)}</Text>
            </Text>
          </View>
          <View>
            <Text>
              Data:
              <Text>{txn[2]}</Text>
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export default TxnPreview
