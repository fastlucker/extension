import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React, { useContext } from 'react'

import Panel from '@modules/common/components/Panel'
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
  onAddExtraToken,
  onAddHiddenToken,
  onRemoveExtraToken,
  onRemoveHiddenToken
}: Props) => {
  const { type } = useContext(AssetsToggleContext)

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
          isLoading={isLoading}
          explorerUrl={explorerUrl}
          networkId={networkId}
          networkRpc={networkRpc}
          networkName={networkName}
          selectedAcc={selectedAcc}
          onAddExtraToken={onAddExtraToken}
          onAddHiddenToken={onAddHiddenToken}
          onRemoveExtraToken={onRemoveExtraToken}
          onRemoveHiddenToken={onRemoveHiddenToken}
        />
      )}
      {type === 'collectibles' && <Collectibles collectibles={collectibles} />}
    </Panel>
  )
}

export default React.memo(Assets)
