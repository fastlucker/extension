import React from 'react'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

import Tokens from '../Tokens'

interface Props {
  tokens: any[]
  extraTokens: any[]
  hiddenTokens: any[]
  protocols: any[]
  isLoading: boolean
  explorerUrl?: string
  networkId?: string
  networkRpc?: string
  networkName?: string
  selectedAcc: string
  onAddExtraToken: (extraToken: any) => void
  onAddHiddenToken: (hiddenToken: any) => void
  onRemoveExtraToken: (address: string) => void
  onRemoveHiddenToken: (address: string) => void
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
