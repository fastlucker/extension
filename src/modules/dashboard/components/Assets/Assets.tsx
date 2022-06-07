import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/accounts'
import { UsePortfolioReturnTypes } from 'ambire-common/src/hooks/usePortfolio/types'
import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

import Tokens from '../Tokens'

interface Props {
  tokens: UsePortfolioReturnTypes['tokens']
  extraTokens: UsePortfolioReturnTypes['extraTokens']
  hiddenTokens: UsePortfolioReturnTypes['hiddenTokens']
  protocols: UsePortfolioReturnTypes['protocols']
  isLoading: boolean
  explorerUrl?: NetworkType['explorerUrl']
  networkId?: NetworkId
  networkRpc?: NetworkType['rpc']
  networkName?: NetworkType['name']
  selectedAcc: UseAccountsReturnType['selectedAcc']
  onAddExtraToken: UsePortfolioReturnTypes['onAddExtraToken']
  onAddHiddenToken: UsePortfolioReturnTypes['onAddHiddenToken']
  onRemoveExtraToken: UsePortfolioReturnTypes['onRemoveExtraToken']
  onRemoveHiddenToken: UsePortfolioReturnTypes['onRemoveHiddenToken']
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
