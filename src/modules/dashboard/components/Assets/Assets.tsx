import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/accounts'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

import Tokens from '../Tokens'

interface Props {
  tokens: UsePortfolioReturnType['tokens']
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
  const { t } = useTranslation()

  return (
    <Panel>
      <Title>{t('Assets')}</Title>
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
    </Panel>
  )
}

export default React.memo(Assets)
