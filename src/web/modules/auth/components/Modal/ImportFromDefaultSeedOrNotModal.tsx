import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ImportFromDefaultOrExternalSeedIcon from '@common/assets/svg/ImportFromDefaultOrExternalSeedIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'

import getStyles from './styles'

interface Props {
  onAgree: () => void
  onDeny: () => void
}

const ImportFromDefaultSeedOrNotModal: FC<Props> = ({ onAgree, onDeny }) => {
  const { t } = useTranslation()
  const { styles } = useTheme(getStyles)

  return (
    <View>
      <View style={styles.modalHeader}>
        <Text weight="medium" fontSize={20}>
          {t('Import from default or external Seed Phrase')}
        </Text>
      </View>
      <View style={styles.modalInnerContainer}>
        <View>
          <ImportFromDefaultOrExternalSeedIcon style={spacings.mrLg} />
        </View>
        <Text appearance="secondaryText">
          {t(
            'You can import accounts by using the default Seed Phrase for this Ambire Wallet extension, or by typing an external Seed Phrase, which you might have from another Ambire Wallet extension or Web3 wallet.'
          )}
        </Text>
      </View>
      <View style={styles.modalButtonsContainer}>
        <Button
          text={t('Use default seed')}
          onPress={onAgree}
          hasBottomSpacing={false}
          size="large"
          style={styles.button}
        />
        <Button
          text={t('Use external seed')}
          onPress={onDeny}
          type="secondary"
          hasBottomSpacing={false}
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  )
}

export default React.memo(ImportFromDefaultSeedOrNotModal)
