import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import EmailRecoveryIcon from '@common/assets/svg/EmailRecoveryIcon'
import SeedPhraseRecoveryIcon from '@common/assets/svg/SeedPhraseRecoveryIcon'
import Alert from '@common/components/Alert'
import Banner, { BannerButton } from '@common/components/Banner'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

interface Props {
  handleEmailPress: () => void
  handleSeedPress: () => void
}

const HotWalletCreateCards: FC<Props> = ({ handleEmailPress, handleSeedPress }) => {
  const { t } = useTranslation()
  const { hasKeystoreSavedSeed } = useKeystoreControllerState()

  return (
    <View>
      <View style={[flexbox.directionRow, spacings.mbLg]}>
        <Card
          title={t('Set up with an email')}
          text={t(
            'This option lets you quickly and easily open a secure Smart Account wallet with just an email. It also allows you to recover your account with your email.'
          )}
          style={{
            width: 324
          }}
          icon={EmailRecoveryIcon}
          buttonText={t('Show interest')}
          onPress={handleEmailPress}
          isPartiallyDisabled
          isSecondary
        >
          <Alert
            title=""
            type="info"
            text="If you'd like to show interest in email-recoverable accounts, please vote here."
            style={spacings.mbSm}
          />
        </Card>
        <Card
          testID="set-up-with-seed-phrase-btn"
          title={t('Set up with a Seed Phrase')}
          style={{
            ...spacings.ml,
            width: 324
          }}
          text={t(
            'This option lets you open a secure Smart Account wallet with a traditional 12-word seed phrase. The unique seed phrase allows you to recover your account, but keeping it secret and secure is vital for the account integrity.'
          )}
          icon={SeedPhraseRecoveryIcon}
          buttonText={t('Proceed')}
          onPress={handleSeedPress}
          isDisabled={!!hasKeystoreSavedSeed}
        />
      </View>
      <Banner
        title="Ambire v1 accounts"
        text={t(
          'If you are looking to import accounts from the web app (Ambire v1), please read this.'
        )}
        type="info2"
        renderButtons={
          <BannerButton
            onPress={() =>
              openInTab(
                'https://help.ambire.com/hc/en-us/articles/15468208978332-How-to-add-your-v1-account-to-Ambire-Wallet-extension',
                false
              )
            }
            text={t('Read more')}
            type="info2"
          />
        }
        style={{ width: 664 }}
      />
    </View>
  )
}

export default React.memo(HotWalletCreateCards)
