import React from 'react'
import isEqual from 'react-fast-compare'

import { useTranslation } from '@config/localization'
import Panel from '@modules/common/components/Panel'
import Title from '@modules/common/components/Title'

import Tokens from '../Tokens'

interface Props {
  tokens: any[]
  protocols: any[]
  isLoading: boolean
  explorerUrl?: string
  networkId?: string
  selectedAcc: string
}

const Assets = ({ tokens, protocols, isLoading, explorerUrl, networkId, selectedAcc }: Props) => {
  const { t } = useTranslation()

  return (
    <Panel>
      <Title>{t('Assets')}</Title>
      <Tokens
        tokens={tokens}
        protocols={protocols}
        isLoading={isLoading}
        explorerUrl={explorerUrl}
        networkId={networkId}
        selectedAcc={selectedAcc}
      />
    </Panel>
  )
}

export default React.memo(Assets, isEqual)
