import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'
import useTheme from '@common/hooks/useTheme'
import { useTranslation } from '@common/config/localization'
import BottomSheet from '@common/components/BottomSheet'
import ScrollableWrapper from '@common/components/ScrollableWrapper'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import colors from '@common/styles/colors'
import { PortalHost } from '@gorhom/portal'
import AmbireLogoHorizontal from '../AmbireLogoHorizontal'
import Button from '../Button'
import Text from '../Text'

interface Props {
  error: Error
}

const ErrorBoundary = ({ error }: Props) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  // Please note that we also need to render `<PortalHost name="global" />` here.
  // If an error occurs, AppInit -> PortalHost will not be rendered because `ErrorBoundary` is a top-level component,
  // which prevents PortalHost from being rendered as well.
  // We attempted to render PortalHost as a top-level component, but this approach does not work.
  // Therefore, we need to render it in two places: here and in AppInit.
  // This is not an issue, as either ErrorBoundary or the remaining components will be mounted,
  // ensuring that PortalHost is only rendered once.
  return (
    <>
      <PortalHost name="global" />
      <BottomSheet
        id="error-boundary-bottom-sheet"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheet}
        type="modal"
        shouldBeClosableOnDrag={false}
        style={{
          overflow: 'hidden',
          width: 512
        }}
        scrollViewProps={{
          contentContainerStyle: { flex: 1 },
          scrollEnabled: false
        }}
        containerInnerWrapperStyles={flexbox.flex1}
      >
        <Text
          fontSize={20}
          weight="semiBold"
          numberOfLines={1}
          style={{ ...spacings.mbLg, textAlign: 'center' }}
        >
          {t('Error Details')}
        </Text>

        <Text style={spacings.mb}>
          {t(
            'This report provides technical details. Please share it with our support team for faster assistance.'
          )}
        </Text>

        <ScrollableWrapper>
          <Text
            fontSize={12}
            selectable
            style={[
              common.borderRadiusPrimary,
              spacings.pvMd,
              spacings.phMd,
              { backgroundColor: colors.wheat }
            ]}
          >
            {error.stack}
          </Text>
        </ScrollableWrapper>

        <View style={[spacings.ptMd, flexbox.alignCenter]}>
          <Button
            text={t('Close')}
            type="secondary"
            size="small"
            onPress={() => closeBottomSheet()}
            hasBottomSpacing={false}
          />
        </View>
      </BottomSheet>

      <View
        style={[
          flexbox.flex1,
          flexbox.center,
          {
            backgroundColor: theme.secondaryBackground
          }
        ]}
      >
        <View
          style={[
            spacings.pvXl,
            spacings.ph2Xl,
            flexbox.alignCenter,
            common.borderRadiusPrimary,
            {
              backgroundColor: theme.primaryBackground,
              borderColor: theme.secondaryBorder,
              borderWidth: 1
            }
          ]}
        >
          <AmbireLogoHorizontal width={124} height={43} style={spacings.mbXl} />
          <Text
            fontSize={20}
            weight="medium"
            style={[text.center, spacings.mbMd, { maxWidth: 360 }]}
          >
            {t('Something went wrong, but your funds are safe!')}
          </Text>
          <View
            style={{
              maxWidth: 296,
              marginHorizontal: 'auto'
            }}
          >
            <Text fontSize={14} style={[text.center, spacings.mbMd]}>
              {t('If the problem persists, please contact us via our')}
              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore, window can't be null
                  window.open('https://help.ambire.com/hc', '_blank').focus()
                }}
              >
                <Text fontSize={14} weight="medium" color={theme.primary}>
                  {' '}
                  {t('Help Center')}
                </Text>
              </TouchableOpacity>
            </Text>
          </View>

          <Button
            style={{
              width: 200
            }}
            text={t('Reload')}
            onPress={() => window.location.reload()}
            hasBottomSpacing={false}
          />

          <TouchableOpacity
            style={{
              ...spacings.mtXl
            }}
            onPress={() => openBottomSheet()}
          >
            <Text fontSize={12} underline>
              {t('Show Details')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

export default React.memo(ErrorBoundary)
