import React from 'react'
import { useTranslation } from 'react-i18next'

import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

const EmptyListPlaceholder = () => {
  const { t } = useTranslation()
  return (
    <Text
      style={[spacings.pv, flexbox.flex1, text.center]}
      numberOfLines={1}
      appearance="secondaryText"
      fontSize={14}
    >
      {t('No items found')}
    </Text>
  )
}

export default EmptyListPlaceholder
