import React, { useEffect } from 'react'

import useNavigation from '@common/hooks/useNavigation'
import useStepper from '@common/modules/auth/hooks/useStepper'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import AccountsList from '@web/modules/accounts-importer/components/AccountsList'
import useAccountsPagination from '@web/modules/accounts-importer/hooks/useAccountsPagination'

interface Props {}

const LegacyImportManager: React.FC<Props> = (props) => {
  const [keysList, setKeysList] = React.useState<any[]>([])

  const [loading, setLoading] = React.useState(true)
  const { navigate } = useNavigation()
  const { updateStepperState } = useStepper()
  const { pageStartIndex } = useAccountsPagination()

  const onImportReady = () => {
    updateStepperState(1, 'legacyAuth')
    navigate(WEB_ROUTES.createKeyStore)
  }

  const onCreateEmailVaultStep = () => {
    updateStepperState(1, 'legacyAuth')
    navigate(WEB_ROUTES.createEmailVault, {
      state: {
        hideStepper: true,
        hideFormTitle: true
      }
    })
  }

  useEffect(() => {
    setKeysList([
      '0496026e6b11fc156fb468efde8072d5ffc4cf3b288b8948fe72cecf2571f09e097be4a21c2a925e482141004b69881a94256acd0cf1186257ab7b7998e9022d65',
      '0496026e6b11fc156fb468efde8072d5ffc4cf3b288b8948fe72cecf2571f09e097be4a21c2a925e482141004b69881a94256acd0cf1186257ab7b7998e9022d62',
      '0496026e6b11fc156fb468efde8072d5ffc4cf3b288b8948fe72cecf2571f09e097be4a21c2a925e482141004b69881a94256acd0cf1186257ab7b7998e9022d61',
      '0496026e6b11fc156fb468efde8072d5ffc4cf3b288b8948fe72cecf2571f09e097be4a21c2a925e482141004b69881a94256acd0cf1186257ab7b7998e9022d60',
      '0496026e6b11fc156fb468efde8072d5ffc4cf3b288b8948fe72cecf2571f09e097be4a21c2a925e482141004b69881a94256acd0cf1186257ab7b7998e9022d69'
    ])
    setLoading(false)
  }, [])

  return (
    <AccountsList
      accounts={keysList.map((key, i) => ({
        address: key,
        index: pageStartIndex + i + 1
      }))}
      loading={loading}
      onImportReady={onImportReady}
      enableCreateEmailVault
      onCreateEmailVaultStep={onCreateEmailVaultStep}
      {...props}
    />
  )
}

export default React.memo(LegacyImportManager)
