import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking } from 'react-native'

import Button from '@modules/common/components/Button'
import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const MANAGE_IDENTIFIABLE_DATA_LINK = 'https://wallet.ambire.com/#/wallet/security'

const DataDeletionPolicy = () => {
  const { t } = useTranslation()

  const handleLinkPress = useCallback(() => Linking.openURL(MANAGE_IDENTIFIABLE_DATA_LINK), [])

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text style={spacings.mbSm}>
          <Text>{t('Ambire accounts are blockchain accounts and they contain ')}</Text>
          <Text weight="regular">{t('no identifiable data.')}</Text>
        </Text>
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
            'There is a procedure to delete the email and it can be securely done via accessing the Ambire web app. From the security page:'
          )}
        </Text>
        <Text style={spacings.mbSm}>{t('1) Add a secondary signer key and')}</Text>
        <Text style={spacings.mbLg}>
          {t('2) Remove the email signer key\n(the only identifiable data there is).')}
        </Text>
        <Button text={t('Manage identifiable data')} onPress={handleLinkPress} />
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DataDeletionPolicy
