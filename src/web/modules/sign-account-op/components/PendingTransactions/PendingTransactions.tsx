import { keccak256, toUtf8Bytes } from 'ethers'
import React, { FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { humanizeAccountOp } from '@ambire-common/libs/humanizer'
import { IrCall } from '@ambire-common/libs/humanizer/interfaces'
import { stringify } from '@ambire-common/libs/richJson/richJson'
import NetworkBadge from '@common/components/NetworkBadge'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useSignAccountOpControllerState from '@web/hooks/useSignAccountOpControllerState'
import SectionHeading from '@web/modules/sign-account-op/components/SectionHeading'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import { Hex } from '@ambire-common/interfaces/hex'
import { getContractImplementation } from '@ambire-common/libs/7702/7702'
import ExpandableCard from '@common/components/ExpandableCard'
import Text from '@common/components/Text'
import PendingTransactionsSkeleton from './PendingTransactionsSkeleton'
import getStyles from './styles'

interface Props {
  network?: Network
  setDelegation?: boolean
  delegatedContract?: Hex | null
}

const PendingTransactions: FC<Props> = ({ network, setDelegation, delegatedContract }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)
  const { accountOp } = useSignAccountOpControllerState() || {}
  const oldAccountOpRelevantInfoHash = React.useRef<string>('')
  const [callsToVisualize, setCallsToVisualize] = React.useState<IrCall[]>([])

  useEffect(() => {
    if (!accountOp) return
    const actualDependencyArrayAsString = stringify([
      accountOp.calls,
      accountOp.chainId,
      accountOp.accountAddr
    ])
    const newAccountOpRelevantInfoHash = keccak256(toUtf8Bytes(actualDependencyArrayAsString))

    const hasAccountOpChangedSincePrevRender =
      oldAccountOpRelevantInfoHash.current !== newAccountOpRelevantInfoHash

    if (!hasAccountOpChangedSincePrevRender) return

    setCallsToVisualize(humanizeAccountOp(accountOp, {}))

    oldAccountOpRelevantInfoHash.current = newAccountOpRelevantInfoHash
  }, [accountOp])

  const isDelegatedContractAmbire = useMemo(() => {
    return (
      network &&
      delegatedContract &&
      getContractImplementation(network.chainId).toLowerCase() === delegatedContract.toLowerCase()
    )
  }, [network, delegatedContract])

  return (
    <View style={spacings.mbLg}>
      <View
        style={[
          flexbox.directionRow,
          flexbox.alignCenter,
          flexbox.justifySpaceBetween,
          spacings.mbSm
        ]}
      >
        <SectionHeading withMb={false}>{t('Overview')}</SectionHeading>
        <NetworkBadge chainId={network?.chainId} withOnPrefix />
      </View>
      {setDelegation !== undefined ? (
        <View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
            <ExpandableCard
              enableToggleExpand={false}
              hasArrow={false}
              style={{ width: '100%' }}
              content={
                <Text>
                  {setDelegation ? (
                    <>
                      <Text weight="semiBold">Enable </Text>
                      <Text>the Ambire EIP-7702 Delegation for this account</Text>
                    </>
                  ) : (
                    <>
                      <Text weight="semiBold">Revoke </Text>
                      <Text>
                        the {isDelegatedContractAmbire ? 'Ambire ' : ''}EIP-7702 Delegation for this
                        account
                      </Text>
                      {!isDelegatedContractAmbire && (
                        <Text weight="semiBold">: {delegatedContract}</Text>
                      )}
                    </>
                  )}
                </Text>
              }
            />
          </View>
        </View>
      ) : (
        <ScrollableWrapper style={styles.transactionsScrollView} scrollEnabled>
          {network && callsToVisualize.length ? (
            callsToVisualize.map((call, i) => {
              return (
                <TransactionSummary
                  key={call.id}
                  style={i !== callsToVisualize.length - 1 ? spacings.mbTy : {}}
                  call={call}
                  chainId={network.chainId}
                  index={i}
                />
              )
            })
          ) : (
            <PendingTransactionsSkeleton />
          )}
        </ScrollableWrapper>
      )}
    </View>
  )
}

export default PendingTransactions
