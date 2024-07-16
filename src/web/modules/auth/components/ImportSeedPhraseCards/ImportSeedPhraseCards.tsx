import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

interface Props {
  handleImportSeed: () => void
  handleImportAccounts: () => void
}

const ImportSeedPhraseCards: FC<Props> = ({ handleImportSeed, handleImportAccounts }) => {
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()

  return (
    <View style={[flexbox.directionRow]}>
      <Card
        title={t('Import Seed Phrase')}
        text={t(
          'This seed phrase will become the main seed phrase for the Ambire Extension, and all future hot accounts will be generated from it.'
        )}
        style={{ width: 296 }}
        // TODO: fix icon
        icon={SeedPhraseRecoveryIcon}
        buttonText={keystoreState.statuses.addSeed !== 'INITIAL' ? t('Loading...') : t('Select')}
        onPress={handleImportSeed}
      />
      <Card
        title={t('Import Accounts from Seed Phrase')}
        style={{ ...spacings.ml, width: 296 }}
        text={t(
          'This seed phrase will NOT be imported into the Ambire Extension. Only the accounts you choose at the moment will be imported'
        )}
        // TODO: fix icon
        icon={SeedPhraseRecoveryIcon}
        buttonText={t('Select')}
        onPress={handleImportAccounts}
      />
    </View>
  )
}

export default React.memo(ImportSeedPhraseCards)
