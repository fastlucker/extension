import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React, { useContext } from 'react'
import { Linking } from 'react-native'

import { Trans } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import TextWarning from '@modules/common/components/TextWarning'
import spacings from '@modules/common/styles/spacings'
import { AssetsToggleContext } from '@modules/dashboard/contexts/assetsToggleContext'

import Collectibles from '../Collectibles'
import Tokens from '../Tokens'

interface Props {
  tokens: UsePortfolioReturnType['tokens']
  collectibles: UsePortfolioReturnType['collectibles']
  extraTokens: UsePortfolioReturnType['extraTokens']
  hiddenTokens: UsePortfolioReturnType['hiddenTokens']
  protocols: UsePortfolioReturnType['protocols']
  isLoading: boolean
  explorerUrl?: NetworkType['explorerUrl']
  networkId?: NetworkId
  networkRpc?: NetworkType['rpc']
  networkName?: NetworkType['name']
  selectedAcc: UseAccountsReturnType['selectedAcc']
  isCurrNetworkBalanceLoading: boolean
  isCurrNetworkProtocolsLoading: boolean
  onAddExtraToken: UsePortfolioReturnType['onAddExtraToken']
  onAddHiddenToken: UsePortfolioReturnType['onAddHiddenToken']
  onRemoveExtraToken: UsePortfolioReturnType['onRemoveExtraToken']
  onRemoveHiddenToken: UsePortfolioReturnType['onRemoveHiddenToken']
}

const Assets = ({
  tokens,
  collectibles,
  extraTokens,
  hiddenTokens,
  protocols,
  isLoading,
  explorerUrl,
  networkId,
  networkRpc,
  networkName,
  selectedAcc,
  isCurrNetworkBalanceLoading,
  isCurrNetworkProtocolsLoading,
  onAddExtraToken,
  onAddHiddenToken,
  onRemoveExtraToken,
  onRemoveHiddenToken
}: Props) => {
  const { type } = useContext(AssetsToggleContext)
  const handleGoToBlockExplorer = () => Linking.openURL(`${explorerUrl}/address/${selectedAcc}`)

  return (
    <Panel
      style={{
        borderTopStartRadius: type === 'tokens' ? 0 : 13,
        borderTopEndRadius: type === 'collectibles' ? 0 : 13
      }}
    >
      {type === 'tokens' && (
        <Tokens
          tokens={tokens}
          extraTokens={extraTokens}
          hiddenTokens={hiddenTokens}
          protocols={protocols}
          networkId={networkId}
          networkRpc={networkRpc}
          networkName={networkName}
          selectedAcc={selectedAcc}
          isCurrNetworkBalanceLoading={!!isCurrNetworkBalanceLoading}
          isCurrNetworkProtocolsLoading={!!isCurrNetworkProtocolsLoading}
          onAddExtraToken={onAddExtraToken}
          onAddHiddenToken={onAddHiddenToken}
          onRemoveExtraToken={onRemoveExtraToken}
          onRemoveHiddenToken={onRemoveHiddenToken}
        />
      )}
      {type === 'collectibles' && (
        <Collectibles collectibles={collectibles} isLoading={isLoading} />
      )}
      <TextWarning appearance="info" style={spacings.mb0}>
        <Trans>
          <Text type="caption">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            If you don't see a specific token that you own, please check the{' '}
            <Text weight="medium" type="caption" onPress={handleGoToBlockExplorer}>
              Block Explorer
            </Text>
          </Text>
        </Trans>
      </TextWarning>
    </Panel>
  )
}

export default React.memo(Assets)
