import React from 'react'
import { useTranslation } from 'react-i18next'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Text from '@modules/common/components/Text'
import Wrapper from '@modules/common/components/Wrapper'
import spacings from '@modules/common/styles/spacings'

const DataDeletionPolicy = () => {
  const { t } = useTranslation()

  return (
    <GradientBackgroundWrapper>
      <Wrapper style={spacings.mt}>
        <Text>
          {t('Ambire accounts are blockchain accounts and they contain no identifiable data.')}
        </Text>
        <Text>
          {t(
            'As such, there is no data deletion possible because 1) there is no identifiable data and 2) there is a significant risk of loss of funds if non-identifiable metadata is deleted, and 3) some account activities or non-identifiable will remain on the blockchain'
          )}
        </Text>
        <Text>
          {t(
            'An exception to this is email/password accounts, which contain one bit of identifiable data, namely the account.'
          )}
        </Text>
        <Text>
          {t(
            'There is a procedure to delete the email and it can be securely done via accessing the web dashboard at http://wallet.ambire.com , from the security page: 1) add a secondary signer key and 2) Remove the email signer key (the only identifiable data there is).'
          )}
        </Text>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default DataDeletionPolicy
