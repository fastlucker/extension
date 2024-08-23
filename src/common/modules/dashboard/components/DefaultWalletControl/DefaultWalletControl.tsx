import React, { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import AmbireNotDefaultWalletLogo from '@common/assets/svg/AmbireNotDefaultWalletLogo'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import { AnimatedPressable, useMultiHover } from '@web/hooks/useHover'
import DURATIONS from '@web/hooks/useHover/durations'
import useWalletStateController from '@web/hooks/useWalletStateController'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const { isPopup } = getUiType()

const DefaultWalletControl = () => {
  const { theme, styles } = useTheme(getStyles)
  const { dispatch } = useBackgroundService()
  const { isDefaultWallet } = useWalletStateController()
  const { t } = useTranslation()

  const [bindControlPositionAnim, controlPositionStyles] = useMultiHover({
    values: [{ property: 'bottom', from: -35, to: 0, duration: DURATIONS.REGULAR }]
  })

  const toggleIsDefaultWallet = useCallback(() => {
    dispatch({
      type: 'SET_IS_DEFAULT_WALLET',
      params: { isDefaultWallet: !isDefaultWallet }
    })
  }, [isDefaultWallet, dispatch])

  if (!isPopup) return null

  return (
    <AnimatedPressable
      style={[
        styles.container,
        {
          backgroundColor: isDefaultWallet ? theme.infoBackground : '#FCF0ED',
          borderColor: isDefaultWallet ? theme.primary : '#F6851B',
          bottom: 0,
          shadowColor: isDefaultWallet ? '#6000FF29' : '#F6851B29'
        },
        controlPositionStyles
      ]}
      onHoverIn={bindControlPositionAnim.onHoverIn}
      onHoverOut={bindControlPositionAnim.onHoverOut}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.pvMi]}>
        <View style={spacings.mrTy}>
          {isDefaultWallet ? (
            <AmbireLogo width={14} height={22} />
          ) : (
            <AmbireNotDefaultWalletLogo width={14} height={22} />
          )}
        </View>
        <View>
          {isDefaultWallet ? (
            <Trans>
              <Text>
                <Text fontSize={12} appearance="secondaryText" weight="semiBold">
                  Ambire
                </Text>{' '}
                <Text fontSize={12} appearance="secondaryText">
                  is your default wallet
                </Text>
              </Text>
            </Trans>
          ) : (
            <Trans>
              <Text>
                <Text fontSize={12} weight="semiBold" color="#CD6116">
                  Ambire
                </Text>{' '}
                <Text fontSize={12} color="#CD6116">
                  is
                </Text>{' '}
                <Text fontSize={12} weight="semiBold" color="#CD6116">
                  NOT
                </Text>{' '}
                <Text fontSize={12} color="#CD6116">
                  your default wallet
                </Text>{' '}
              </Text>
            </Trans>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={toggleIsDefaultWallet} style={styles.selectWrapper}>
        {isDefaultWallet ? (
          <Text fontSize={12} underline color="#CD6116">
            {t('Set another wallet as default >')}
          </Text>
        ) : (
          <Text fontSize={12} appearance="primary" underline>
            {t('Make Ambire your default wallet >')}
          </Text>
        )}
      </TouchableOpacity>
    </AnimatedPressable>
  )
}

export default React.memo(DefaultWalletControl)
