import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import CartIcon from '@common/assets/svg/CartIcon'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'

type Props = {
  sheetRef: React.RefObject<any>
  closeBottomSheet: () => void
}

const BatchModal: FC<Props> = ({ sheetRef, closeBottomSheet }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { navigate } = useNavigation()

  const onSecondaryButtonPress = useCallback(() => {
    closeBottomSheet()
  }, [closeBottomSheet])
  const onPrimaryButtonPress = useCallback(() => {
    navigate(WEB_ROUTES.dashboard)
  }, [navigate])

  return (
    <BottomSheet
      backgroundColor="primaryBackground"
      sheetRef={sheetRef}
      closeBottomSheet={closeBottomSheet}
      id="batch-modal"
    >
      <View style={[flexbox.alignCenter, flexbox.justifyCenter, spacings.pt2Xl, spacings.pbXl]}>
        <CartIcon width={64} height={64} color={theme.secondaryText} />
        <Text fontSize={20} weight="medium" style={[spacings.mbTy, spacings.mtLg, text.center]}>
          {t('Added to batch')}
        </Text>
        <Text weight="medium" appearance="secondaryText" style={text.center}>
          {t('You can manage your batch in the dashboard.')}
        </Text>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: theme.secondaryBorder,
          ...spacings.mvLg
        }}
      />
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
        <Button
          onPress={onSecondaryButtonPress}
          hasBottomSpacing={false}
          type="secondary"
          text={t('Add more swaps?')}
        />
        <Button
          onPress={onPrimaryButtonPress}
          hasBottomSpacing={false}
          style={{ width: 160 }}
          text={t('Close')}
        />
      </View>
    </BottomSheet>
  )
}

export default BatchModal
