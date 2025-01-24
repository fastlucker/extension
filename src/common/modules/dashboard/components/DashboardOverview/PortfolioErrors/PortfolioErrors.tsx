import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Easing, Pressable, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { Action, SelectedAccountBalanceError } from '@ambire-common/libs/selectedAccount/errors'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Alert from '@common/components/Alert'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Tooltip from '@common/components/Tooltip'
import { isWeb } from '@common/config/env'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'

import Header from './Header'
import PortfolioErrorActions from './PortfolioErrorActions'

type Props = {
  networksWithErrors: string[]
  reloadAccount: () => void
}

const PortfolioErrors: FC<Props> = ({ reloadAccount, networksWithErrors }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { balanceAffectingErrors, portfolio, portfolioStartedLoadingAtTimestamp } =
    useSelectedAccountControllerState()
  const { isOffline } = useMainControllerState()
  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()
  const [isLoadingTakingTooLong, setIsLoadingTakingTooLong] = useState(false)
  /** Because errors change frequently due to background updates we have to store a snapshot
   * of the errors when the user clicks on the warning icon to display the errors in the bottom sheet.
   * Otherwise the user may want to screenshot the errors and the errors may change.
   */
  const [balanceAffectingErrorsSnapshot, setBalanceAffectingErrorsSnapshot] = useState<
    SelectedAccountBalanceError[]
  >([])

  const areErrorsOutdatedAndPortfolioIsReady = useMemo(() => {
    return (
      balanceAffectingErrorsSnapshot.length > 0 &&
      portfolio.isAllReady &&
      !balanceAffectingErrors.length
    )
  }, [balanceAffectingErrors.length, balanceAffectingErrorsSnapshot.length, portfolio.isAllReady])

  const warningMessage = useMemo(() => {
    if (isLoadingTakingTooLong) {
      return t('Loading all networks is taking too long.')
    }

    if (isOffline && portfolio.isAllReady) return t('Please check your internet connection.')

    if (balanceAffectingErrors.length) {
      return t(
        'Total balance may be inaccurate due to issues on {{networks}}. Click for more info.',
        {
          networks: networksWithErrors.join(', ')
        }
      )
    }

    return undefined
  }, [
    balanceAffectingErrors,
    isLoadingTakingTooLong,
    isOffline,
    networksWithErrors,
    portfolio.isAllReady,
    t
  ])

  const onIconPress = useCallback(() => {
    if (isLoadingTakingTooLong || isOffline) {
      return
    }

    setBalanceAffectingErrorsSnapshot(balanceAffectingErrors)
    openBottomSheet()
  }, [balanceAffectingErrors, isLoadingTakingTooLong, isOffline, openBottomSheet])

  const closeBottomSheetWrapped = useCallback(() => {
    setBalanceAffectingErrorsSnapshot([])
    closeBottomSheet()
  }, [closeBottomSheet])

  const onReloadPress = useCallback(() => {
    reloadAccount()
    closeBottomSheetWrapped()
  }, [closeBottomSheetWrapped, reloadAccount])

  const renderWarningIcon = useCallback(() => {
    return (
      <WarningIcon
        color={theme.warningDecorative}
        style={spacings.mlTy}
        data-tooltip-id="portfolio-warning"
        data-tooltip-content={warningMessage}
        width={21}
        height={21}
      />
    )
  }, [theme.warningDecorative, warningMessage])

  const renderItem = useCallback(
    ({ item: { id, title, text, type, actions } }: any) => (
      <Alert key={id} style={spacings.mbSm} title={title} text={text} type={type}>
        {actions &&
          actions.map(({ actionName, ...rest }: Action) => {
            return (
              <PortfolioErrorActions
                key={actionName}
                actionName={actionName}
                closeBottomSheet={closeBottomSheetWrapped}
                {...rest}
              />
            )
          })}
      </Alert>
    ),
    [closeBottomSheetWrapped]
  )

  const flashingOpacity = useMemo(() => new Animated.Value(1), [])

  // This must be memoized!! Otherwise the bottom sheet will close when the user
  // opens a popup??
  const shouldDisplayWarningIcon = useMemo(() => {
    return warningMessage || balanceAffectingErrorsSnapshot.length
  }, [balanceAffectingErrorsSnapshot.length, warningMessage])

  // Compare the current timestamp with the timestamp when the loading started
  // and if it takes more than 5 seconds, set isLoadingTakingTooLong to true
  useEffect(() => {
    if (!portfolioStartedLoadingAtTimestamp) {
      setIsLoadingTakingTooLong(false)
      return
    }

    const checkIsLoadingTakingTooLong = () => {
      const takesMoreThan5Seconds = Date.now() - portfolioStartedLoadingAtTimestamp > 5000

      setIsLoadingTakingTooLong(takesMoreThan5Seconds)
    }

    checkIsLoadingTakingTooLong()

    const interval = setInterval(() => {
      if (portfolio?.isAllReady) {
        clearInterval(interval)
        setIsLoadingTakingTooLong(false)
        return
      }

      checkIsLoadingTakingTooLong()
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [portfolio?.isAllReady, portfolioStartedLoadingAtTimestamp])

  useEffect(() => {
    if (isLoadingTakingTooLong) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(flashingOpacity, {
            toValue: 0.2,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: !isWeb
          }),
          Animated.timing(flashingOpacity, {
            toValue: 0.5,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: !isWeb
          })
        ])
      ).start()
    } else {
      flashingOpacity.setValue(1)
    }
  }, [isLoadingTakingTooLong, flashingOpacity])

  if (!shouldDisplayWarningIcon) return null

  return (
    <>
      {isLoadingTakingTooLong ? (
        <Animated.View style={{ opacity: flashingOpacity }}>{renderWarningIcon()}</Animated.View>
      ) : (
        <Pressable onPress={onIconPress} disabled={isLoadingTakingTooLong}>
          {renderWarningIcon()}
        </Pressable>
      )}
      <Tooltip id="portfolio-warning" />
      <BottomSheet
        style={{ maxWidth: 720, ...spacings.pvLg, ...spacings.phXl, width: '100%' }}
        id="portfolio-errors"
        backgroundColor="primaryBackground"
        sheetRef={sheetRef}
        closeBottomSheet={closeBottomSheetWrapped}
        flatListProps={{
          ListHeaderComponent: (
            <Header
              areErrorsOutdatedAndPortfolioIsReady={areErrorsOutdatedAndPortfolioIsReady}
              closeBottomSheetWrapped={closeBottomSheetWrapped}
            />
          ),
          stickyHeaderIndices: [0],
          ListFooterComponent: (
            <View
              style={[
                spacings.ptLg,
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.justifySpaceBetween
              ]}
            >
              <Button
                style={{ width: '100%' }}
                hasBottomSpacing={false}
                text={t('Reload account')}
                onPress={onReloadPress}
              />
            </View>
          ),
          data: balanceAffectingErrorsSnapshot,
          keyExtractor: ({ id }) => id,
          renderItem
        }}
      />
    </>
  )
}

export default PortfolioErrors
