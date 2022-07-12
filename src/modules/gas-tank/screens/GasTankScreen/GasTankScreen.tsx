import { formatFloatTokenAmount } from 'ambire-common/src/services/formatter'
import React from 'react'
import { View } from 'react-native'

import GasTankIcon from '@assets/svg/GasTankIcon'
import { useTranslation } from '@config/localization'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Modal from '@modules/common/components/Modal'
import useModal from '@modules/common/components/Modal/hooks/useModal'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import useRequests from '@modules/common/hooks/useRequests'
import useToast from '@modules/common/hooks/useToast'
import colors from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import GasTankBalance from '@modules/gas-tank/components/GasTankBalance'
import GasTankStateToggle from '@modules/gas-tank/components/GasTankStateToggle'
import GasTankTotalSave from '@modules/gas-tank/components/GasTankTotalSave'
import TokensList from '@modules/gas-tank/components/TokensList'
import TransactionHistoryList from '@modules/gas-tank/components/TransactionsHistoryList'
import useGasTankData from '@modules/gas-tank/hooks/useGasTankData'

const GasTankScreen = () => {
  const { t } = useTranslation()
  const {
    balancesRes,
    gasTankBalances,
    sortedTokens,
    totalSavedResult,
    gasTankFilledTxns,
    feeAssetsRes
  } = useGasTankData()
  const { isCurrNetworkBalanceLoading, isCurrNetworkProtocolsLoading, dataLoaded } = usePortfolio()
  const { network } = useNetwork()
  const { selectedAcc } = useAccounts()
  const { addRequest } = useRequests()
  const { addToast } = useToast()
  const { isModalVisible, showModal, hideModal } = useModal()

  const totalSaved = formatFloatTokenAmount(totalSavedResult, true, 2)

  return (
    <GradientBackgroundWrapper>
      <Wrapper hasBottomTabNav={false}>
        <GasTankStateToggle disabled={!gasTankBalances && !gasTankBalances?.length} />
        <Text style={[spacings.mbSm, spacings.mhSm]} fontSize={12}>
          {t('The Ambire Gas Tank is your special account for paying gas and saving on gas fees.')}
          <Text color={colors.heliotrope} fontSize={12} onPress={showModal}>{`   ${t(
            'learn more...'
          )}`}</Text>
        </Text>
        <Panel>
          <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
            <GasTankBalance
              data={balancesRes && balancesRes.length ? balancesRes : []}
              totalBalance={
                gasTankBalances ? formatFloatTokenAmount(gasTankBalances, true, 2) : '0.00'
              }
              networkId={network?.id}
            />
            <GasTankTotalSave totalSave={totalSaved || '0.00'} />
          </View>
          <TokensList
            tokens={sortedTokens}
            isLoading={
              (isCurrNetworkBalanceLoading || isCurrNetworkProtocolsLoading) && !dataLoaded
            }
            networkId={network?.id}
            chainId={network?.chainId}
            selectedAcc={selectedAcc}
            addRequest={addRequest}
            addToast={addToast}
          />
        </Panel>
        <Panel>
          <TransactionHistoryList
            gasTankFilledTxns={gasTankFilledTxns || []}
            feeAssetsRes={feeAssetsRes || []}
            explorerUrl={network?.explorerUrl || ''}
            networkId={network?.id}
          />
        </Panel>
      </Wrapper>
      <Modal isVisible={isModalVisible} hideModal={hideModal}>
        <View
          style={[
            flexboxStyles.directionRow,
            flexboxStyles.alignCenter,
            flexboxStyles.justifyCenter,
            spacings.mb
          ]}
        >
          <GasTankIcon />
          <Text fontSize={16} style={spacings.plMi}>
            {t('Ambire Gas Tank')}
          </Text>
        </View>
        <Text style={spacings.mbSm} fontSize={12} weight="regular">
          {t(
            'The Ambire Gas Tank is your special account for paying gas and saving on gas fees. By filling up your Gas Tank, you are setting aside, or prepaying for network fees. You can add more tokens to your Gas Tank at any time.'
          )}
        </Text>
        <Text fontSize={12} weight="regular">
          {t('Please note that only the listed tokens are eligible for filling up your gas tank.')}
        </Text>
      </Modal>
    </GradientBackgroundWrapper>
  )
}

export default GasTankScreen
