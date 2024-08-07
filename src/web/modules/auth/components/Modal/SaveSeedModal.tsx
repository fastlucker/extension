import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ImportAccountsFromSeedPhraseIcon from '@common/assets/svg/ImportAccountsFromSeedPhraseIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import getStyles from './styles'

interface Props {
  onAgree: () => void
  onDeny: () => void
}

const SaveSeedModal: FC<Props> = ({ onAgree, onDeny }) => {
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const { styles } = useTheme(getStyles)

  return (
    <View>
      <View style={styles.modalHeader}>
        <Text weight="medium" fontSize={20}>
          {t('Save as default Seed Phrase')}
        </Text>
      </View>
      <View style={styles.modalInnerContainer}>
        <View>
          <ImportAccountsFromSeedPhraseIcon style={spacings.mrLg} />
        </View>
        <Text appearance="secondaryText">
          {t(
            'Do you want to save it as a default Seed Phrase for this Ambire Wallet extension? This will allow you to easily import more Smart Accounts from this Seed Phrase.'
          )}
        </Text>
      </View>
      <View style={styles.modalButtonsContainer}>
        <Button
          text={keystoreState.statuses.addKeys !== 'INITIAL' ? 'Loading...' : t('Yes')}
          onPress={onAgree}
          hasBottomSpacing={false}
          size="large"
          style={styles.button}
          testID="save-seed-button"
        />
        <Button
          text={t('No')}
          onPress={onDeny}
          type="secondary"
          hasBottomSpacing={false}
          size="large"
          style={styles.button}
          testID="do-not-save-seed-button"
        />
      </View>
    </View>
  )
}

export default React.memo(SaveSeedModal)
