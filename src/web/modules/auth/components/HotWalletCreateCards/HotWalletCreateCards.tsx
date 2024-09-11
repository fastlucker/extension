import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmailRecoveryIcon from '@common/assets/svg/EmailRecoveryIcon'
import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

interface Props {
  handleEmailPress: () => void
  handleSeedPress: () => void
}

const HotWalletCreateCards: FC<Props> = ({ handleEmailPress, handleSeedPress }) => {
  const { t } = useTranslation()
  const { hasKeystoreDefaultSeed } = useKeystoreControllerState()
  return (
    <View style={[flexbox.directionRow]}>
      <Card
        title={t('Set up with an email')}
        text={t(
          'This option lets you quickly and easily open a secure Smart Account wallet with just an email. It also allows you to recover your account with your email.'
        )}
        style={{
          width: 296
        }}
        icon={EmailRecoveryIcon}
        buttonText={t('Proceed')}
        onPress={handleEmailPress}
        isDisabled
      />
      <Card
        testID="set-up-with-seed-phrase-btn"
        title={t('Set up with a Seed Phrase')}
        style={{
          ...spacings.ml,
          width: 296
        }}
        text={t(
          'This option lets you open a secure Smart Account wallet with a traditional 12-word seed phrase. The unique seed phrase allows you to recover your account, but keeping it secret and secure is vital for the account integrity.'
        )}
        icon={SeedPhraseRecoveryIcon}
        buttonText={t('Proceed')}
        onPress={handleSeedPress}
        isDisabled={!!hasKeystoreDefaultSeed}
      />
    </View>
  )
}

export default React.memo(HotWalletCreateCards)
