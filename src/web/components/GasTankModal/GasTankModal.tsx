import { formatUnits } from 'ethers'
import { LinearGradient } from 'expo-linear-gradient'
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Animated, Pressable, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { SelectedAccountPortfolio } from '@ambire-common/interfaces/selectedAccount'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { TokenResult } from '@ambire-common/libs/portfolio'
import GasTankIcon from '@common/assets/svg/GasTankIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import ReceivingIcon from '@common/assets/svg/ReceivingIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import SavingsIcon from '@common/assets/svg/SavingsIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import TupUpWithBgIcon from '@common/assets/svg/TupUpWithBgIcon'
import BackButton from '@common/components/BackButton'
import BottomSheet from '@common/components/BottomSheet'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import common from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { createTab } from '@web/extension-services/background/webapi/tab'
import { useCustomHover } from '@web/hooks/useHover'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

type Props = {
  modalRef: any
  handleClose: () => void
  portfolio: SelectedAccountPortfolio
  account: Account | null
}

type BulletContent = {
  key: string
  icon: ReactNode
  text: string
}

const calculateTokenBalance = (token: TokenResult, type: keyof TokenResult) => {
  const amount = token[type]
  const { decimals, priceIn } = token
  const balance = parseFloat(formatUnits(amount, decimals))
  const price =
    priceIn.find(({ baseCurrency }: { baseCurrency: string }) => baseCurrency === 'usd')?.price || 0

  return balance * price
}

const GasTankModal = ({ modalRef, handleClose, portfolio, account }: Props) => {
  const { isPopup } = getUiType()
  const { styles, theme } = useTheme(getStyles)
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [bindAnim, , isHovered] = useCustomHover({
    property: 'borderColor',
    values: {
      from: 'transparent',
      to: theme.primary
    },
    forceHoveredStyle: true
  })

  const isSA = useMemo(() => isSmartAccount(account), [account])

  const gasTankResult = useMemo(
    () => portfolio?.latestStateByNetworks?.gasTank?.result,
    [portfolio?.latestStateByNetworks?.gasTank?.result]
  )

  const calculateBalance = useCallback(
    (key: 'usd' | 'cashback' | 'saved') => {
      if (!account?.addr || !gasTankResult || gasTankResult.tokens.length === 0 || !isSA) return 0
      const token = gasTankResult.tokens[0]

      return key === 'usd'
        ? Number(gasTankResult.total?.[key]) || 0
        : calculateTokenBalance(token, key)
    },
    [account?.addr, gasTankResult, isSA]
  )

  const savedInUsd = useMemo(() => calculateBalance('saved'), [calculateBalance])
  const cashbackInUsd = useMemo(() => calculateBalance('cashback'), [calculateBalance])
  const gasTankTotalBalanceInUsd = useMemo(() => calculateBalance('usd'), [calculateBalance])

  const [visibleCount, setVisibleCount] = useState(0)
  const [animations, setAnimations] = useState<Animated.Value[]>([])

  const bulletsContent: BulletContent[] = useMemo(
    () => [
      {
        key: 'top-up',
        icon: <TupUpWithBgIcon width={32} height={32} />,
        text: 'Top up on any chain and use Gas tank to pay network fees on any other.'
      },
      {
        key: 'receive-cashback',
        icon: <ReceivingIcon width={32} height={32} fillColor={theme.primary} />,
        text: 'Receive cashback from your transactions in your Gas tank.'
      },
      {
        key: 'save',
        icon: (
          <SavingsIcon width={32} height={32} color="white" fillColor={theme.successDecorative} />
        ),
        text: 'Save on network fees by prepaying with Gas tank.'
      }
    ],
    [theme.successDecorative, theme.primary]
  )

  useEffect(() => {
    // Initialize animations for each bullet
    setAnimations(bulletsContent.map(() => new Animated.Value(-200))) // Start off-screen to the left
  }, [bulletsContent])

  const handleOpen = useCallback(() => {
    setVisibleCount(0) // Reset visible count
    // Set 500ms of delay to make sure that modal animation is finished
    setTimeout(() => {
      bulletsContent.forEach((_, index) => {
        setTimeout(() => {
          Animated.timing(animations[index], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }).start()
          setVisibleCount((prev) => prev + 1)
        }, 300 * index)
      })
    }, 500)
  }, [bulletsContent, animations])

  const handleOnClose = useCallback(() => {
    // Set 500ms of delay to make sure that modal animation is finished
    setTimeout(() => {
      // Reset animations
      setAnimations(bulletsContent.map(() => new Animated.Value(-200)))
    }, 500)
    handleClose()
  }, [bulletsContent, handleClose])

  return (
    <BottomSheet
      id="gas-tank-modal"
      type={isPopup ? 'bottom-sheet' : 'modal'}
      sheetRef={modalRef}
      backgroundColor="secondaryBackground"
      containerInnerWrapperStyles={styles.containerInnerWrapper}
      closeBottomSheet={handleOnClose}
      style={{ maxWidth: 600 }}
      onOpen={handleOpen}
    >
      {isSA ? (
        <View style={styles.content}>
          <Text fontSize={20} weight="medium">
            Gas Tank
          </Text>
          <View>
            <View style={styles.balancesWrapper}>
              <View style={{ ...flexbox.alignStart }}>
                <Text fontSize={12} appearance="secondaryText" style={{ ...spacings.pbTy }}>
                  {t('Gas Tank Balance')}
                </Text>
                <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter }}>
                  <GasTankIcon height={40} width={40} />
                  <Text fontSize={32} weight="number_bold" appearance="primaryText">
                    {formatDecimals(gasTankTotalBalanceInUsd, 'price')}
                  </Text>
                </View>
              </View>
              <View style={styles.rightPartWrapper}>
                <View style={styles.rightPartInnerWrapper}>
                  <Text fontSize={12} appearance="successText">
                    {t('Total Saved')}:
                  </Text>
                  <Text fontSize={14} appearance="successText">
                    {formatDecimals(savedInUsd, 'price')}
                  </Text>
                </View>
                <View style={styles.rightPartInnerWrapper}>
                  <Text fontSize={12} appearance="primary">
                    {t('Total Cashback')}:
                  </Text>
                  <Text fontSize={14} appearance="primary">
                    {formatDecimals(cashbackInUsd, 'price')}
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Pressable
                onPress={async () => {
                  try {
                    await createTab(
                      'https://help.ambire.com/hc/en-us/articles/5397969913884-What-is-the-Gas-Tank'
                    )
                  } catch {
                    addToast("Couldn't open link", { type: 'error' })
                  }
                }}
                style={[
                  styles.descriptionTextWrapper,
                  {
                    borderColor: isHovered ? theme.primary : 'transparent'
                  }
                ]}
                {...bindAnim}
              >
                <View style={[flexbox.directionRow]}>
                  <InfoIcon width={20} />
                  <Text style={spacings.mlMd} weight="medium" fontSize={16}>
                    {t('Learn more about Gas Tank')}
                  </Text>
                </View>
                <RightArrowIcon />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={[flexbox.directionRow, flexbox.center, common.fullWidth]}>
            <Text fontSize={20} weight="medium">
              Gas Tank
            </Text>
          </View>
          <View style={[flexbox.directionRow, flexbox.center, common.fullWidth, spacings.mtLg]}>
            <Text fontSize={16} weight="semiBold" appearance="secondaryText">
              {t('Experience the benefits of the gas tank:')}
            </Text>
          </View>
          <View style={[flexbox.justifyStart, flexbox.alignCenter, { height: 276 }]}>
            {bulletsContent.map(
              (bullet, index) =>
                index < visibleCount && (
                  <Animated.View
                    key={bullet.key}
                    style={{
                      transform: [{ translateX: animations[index] }]
                    }}
                  >
                    <LinearGradient
                      colors={[
                        theme.tertiaryBackground as string,
                        theme.primaryBackground as string
                      ]}
                      style={styles.bulletWrapper}
                      start={{ x: 0.15, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={[styles.iconWrapper]}>{bullet.icon}</View>
                      <Text
                        appearance="secondaryText"
                        weight="medium"
                        style={[spacings.mlSm, { lineHeight: 24 }]}
                      >
                        {t(bullet.text)}
                      </Text>
                    </LinearGradient>
                  </Animated.View>
                )
            )}
          </View>
          <View style={[flexbox.directionRow, flexbox.center, common.fullWidth, spacings.pvMd]}>
            <Text fontSize={16} weight="semiBold" appearance="secondaryText">
              {t('To use the gas tank, you need a Smart Account')}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.buttonWrapper}>
        <BackButton onPress={handleClose} />
        <Button
          type="primary"
          text={isSA ? t('Top Up Gas Tank') : t('Ok, create a Smart Account')}
          size="large"
          hasBottomSpacing={false}
          textStyle={{ ...spacings.prSm }}
          onPress={() =>
            isSA ? navigate('transfer?isTopUp') : navigate('account-select?addAccount=true')
          }
        >
          {isSA && <TopUpIcon color="white" strokeWidth={1} width={20} height={20} />}
        </Button>
      </View>
    </BottomSheet>
  )
}

export default React.memo(GasTankModal)
