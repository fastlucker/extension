import { setStringAsync } from 'expo-clipboard'
import React, { FC, useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'

import CopyIcon from '@common/assets/svg/CopyIcon'
import InvisibilityIcon from '@common/assets/svg/InvisibilityIcon'
import VisibilityIcon from '@common/assets/svg/VisibilityIcon'
import Alert from '@common/components/Alert'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import SettingsPageHeader from '@web/modules/settings/components/SettingsPageHeader'

import getStyles from './styles'

interface Props {
  privateKey: string
}

const PrivateKeyExport: FC<Props> = ({ privateKey }) => {
  const { t } = useTranslation()

  const { theme, styles } = useTheme(getStyles)

  const [blurred, setBlurred] = useState<boolean>(true)
  const { navigate } = useNavigation()
  const { addToast } = useToast()

  const handleCopyText = useCallback(async () => {
    if (!privateKey) return
    try {
      await setStringAsync(privateKey)
    } catch {
      addToast('Error copying to clipboard', { type: 'error' })
    }
    addToast('Copied to clipboard!')
  }, [addToast, privateKey])

  const toggleKeyVisibility = useCallback(async () => {
    setBlurred((prev) => !prev)
  }, [])

  const returnToAccounts = () => {
    navigate(ROUTES.accountsSettings)
  }

  return (
    <>
      <SettingsPageHeader title="Private key" />
      <View
        style={[
          blurred ? styles.blurred : styles.notBlurred,
          spacings.pvMd,
          spacings.phMd,
          { backgroundColor: theme.secondaryBackground }
        ]}
      >
        <Text fontSize={14} color={theme.secondaryText}>
          {privateKey}
        </Text>
      </View>
      <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter, spacings.mtSm]}>
        <Pressable
          onPress={handleCopyText}
          style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}
        >
          <Text fontSize={14} color={theme.secondaryText}>
            Copy your private key
          </Text>
          <CopyIcon color={theme.secondaryText} style={spacings.mlTy} />
        </Pressable>
        <Pressable
          onPress={toggleKeyVisibility}
          style={[flexbox.flex1, flexbox.directionRowReverse, flexbox.alignCenter]}
        >
          {blurred ? (
            <VisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
          ) : (
            <InvisibilityIcon color={theme.secondaryText} style={spacings.mlTy} />
          )}
          <Text fontSize={14} color={theme.secondaryText}>
            {blurred ? t('Reveal key') : t('Hide key')}
          </Text>
        </Pressable>
      </View>
      <View style={spacings.mtXl}>
        <Alert
          size="sm"
          type="warning"
          title={t(
            'Warning: Never disclose this key. Anyone with your private key can steal any assets held in your account'
          )}
        />
      </View>
      <Button type="secondary" style={spacings.mtTy} onPress={returnToAccounts} text="Back" />
    </>
  )
}

export default React.memo(PrivateKeyExport)
