import * as Clipboard from 'expo-clipboard'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CopyIcon from '@assets/svg/CopyIcon'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import useAccounts from '@modules/common/hooks/useAccounts'
import useToast from '@modules/common/hooks/useToast'

const CopyAddress: React.FC = () => {
  const { t } = useTranslation()
  const { addToast } = useToast()
  const { selectedAcc } = useAccounts()

  const handleCopyAddress = () => {
    Clipboard.setString(selectedAcc)
    addToast(t('Address copied to clipboard!') as string, { timeout: 2000 })
  }

  return (
    <NavIconWrapper onPress={handleCopyAddress}>
      <CopyIcon />
    </NavIconWrapper>
  )
}

export default CopyAddress
