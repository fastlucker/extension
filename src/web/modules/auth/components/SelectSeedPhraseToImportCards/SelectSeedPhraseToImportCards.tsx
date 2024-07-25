import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

interface Props {
  handleImportFromDefaultSeed: () => void
  handleImportFromExternalSeed: () => void
}

const SelectSeedPhraseToImportCards: FC<Props> = ({
  handleImportFromDefaultSeed,
  handleImportFromExternalSeed
}) => {
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()

  return (
    <View style={[flexbox.directionRow]}>
      <Card
        title={t('Import Accounts from Main Seed Phrase')}
        text={t(
          'Import accounts from you main seed phrase that is safely stored in the Ambire Extension.'
        )}
        style={{ width: 296 }}
        isSecondary
        // TODO: fix icon
        icon={SeedPhraseRecoveryIcon}
        buttonText={keystoreState.statuses.addSeed !== 'INITIAL' ? t('Loading...') : t('Select')}
        onPress={handleImportFromDefaultSeed}
      />
      <Card
        title={t('Import Accounts from External Seed Phrase')}
        style={{ ...spacings.ml, width: 296 }}
        text={t(
          'Import accounts using any seed phrase. Please note that ONLY the accounts will be imported, NOT the seed phrase itself.'
        )}
        isSecondary
        // TODO: fix icon
        icon={SeedPhraseRecoveryIcon}
        buttonText={t('Select')}
        onPress={handleImportFromExternalSeed}
      />
    </View>
  )
}

export default React.memo(SelectSeedPhraseToImportCards)
