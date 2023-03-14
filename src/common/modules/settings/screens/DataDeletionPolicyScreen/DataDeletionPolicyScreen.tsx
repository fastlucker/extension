import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper from '@common/components/Wrapper'
import spacings from '@common/styles/spacings'

const MANAGE_IDENTIFIABLE_DATA_LINK = 'https://wallet.ambire.com/#/wallet/security'

const DataDeletionPolicy = () => {
  const { t } = useTranslation()

  const handleLinkPress = useCallback(() => Linking.openURL(MANAGE_IDENTIFIABLE_DATA_LINK), [])

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Trans>
          <Text style={spacings.mbSm}>
            <Text>Ambire accounts are blockchain accounts and they contain </Text>
            <Text weight="regular">no identifiable data.</Text>
          </Text>
        </Trans>
        <Text style={spacings.mbSm}>
          {t(
            'As such, there is no data deletion possible because 1) there is no identifiable data and 2) there is a significant risk of loss of funds if non-identifiable metadata is deleted, and 3) some account activities or non-identifiable will remain on the blockchain'
          )}
        </Text>
        <Text style={spacings.mbSm}>
          {t(
            'An exception to this is email/password accounts, which contain one bit of identifiable data, namely the account.'
          )}
        </Text>
        <Text style={spacings.mbSm}>
          {t(
            'There is a procedure to delete the email and it can be securely done via accessing the Ambire web app. In the security section:'
          )}
        </Text>
        <Text style={spacings.mbSm}>{t('1) Add a secondary signer key and')}</Text>
        <Text style={spacings.mbLg}>
          {t('2) Remove the email signer key\n(the only identifiable data there is).')}
        </Text>
        <Button type="primary" text={t('Manage identifiable data')} onPress={handleLinkPress} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DataDeletionPolicy
