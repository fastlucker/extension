import React, { useMemo } from 'react'
import { Image, Pressable, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { SelectedAccountPortfolio } from '@ambire-common/interfaces/selectedAccount'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import image from '@common/assets/images/cashEarned.png'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import { BORDER_RADIUS_PRIMARY } from '@common/styles/utils/common'
import flexbox from '@common/styles/utils/flexbox'
import { createTab } from '@web/extension-services/background/webapi/tab'
import { calculateGasTankBalance } from '@web/utils/calculateGasTankBalance'

import ConfettiAnimation from '../../ConfettiAnimation'
import BackdropWithHole from './BackdropWithHole'
import getStyles from './styles'

type Props = {
  onPress: () => void
  position: {
    x: number
    y: number
    width: number
    height: number
  } | null
  portfolio: SelectedAccountPortfolio
  account: Account | null
}

const CongratsFirstCashbackModal = ({ onPress, position, portfolio, account }: Props) => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)
  const { addToast } = useToast()

  const isSA = useMemo(() => isSmartAccount(account), [account])

  const cashbackInUsd = useMemo(
    () => calculateGasTankBalance(portfolio, account, isSA, 'cashback'),
    [account, isSA, portfolio]
  )

  return position ? (
    <>
      <View
        style={[
          styles.container,
          position ? { top: position.y - 50, left: position.x + position.width + 15 } : {}
        ]}
      >
        <ConfettiAnimation width={200} height={200} style={{ zIndex: 10 }} autoPlay loop />
        <View>
          <Image
            source={image}
            style={{
              height: 64,
              width: 116,
              ...spacings.mvMd
            }}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={flexbox.flex1}>
            <View style={flexbox.center}>
              <Text fontSize={20} weight="semiBold" style={spacings.mbTy}>
                {t('Wo-hoo')}
              </Text>
              <Text fontSize={14} weight="medium" style={spacings.mbSm}>
                {t('You just got your first cashback.')}
              </Text>
            </View>
            <Trans>
              <Text fontSize={12} appearance="secondaryText" style={spacings.mbSm}>
                {`You've received ${formatDecimals(
                  cashbackInUsd,
                  'price'
                )} cashback, now on your Gas Tank, from your first smart account transaction!`}
              </Text>
              <Text fontSize={12} appearance="secondaryText">
                When using a Smart Account, cashback gets credited to your Gas Tank. Cashback comes
                from transaction savings and fee optimizations processed through the Ambire Relayer.
              </Text>
            </Trans>
            {/* TODO: Check it the URL is the right one */}
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
            >
              <Text appearance="primary" fontSize={12} underline>
                {t('Learn more >')}
              </Text>
            </Pressable>
          </View>
          <View style={[flexbox.directionRow, flexbox.justifyEnd]}>
            <Button
              testID="confetti-modal-action-button"
              type="secondary"
              size="small"
              text={t('Got it')}
              style={{ minWidth: 96 }}
              onPress={onPress}
              hasBottomSpacing={false}
              submitOnEnter
            />
          </View>
        </View>
      </View>
      <View
        style={[
          styles.arrow,
          {
            zIndex: 101,
            position: 'absolute',
            top: position.y + 6,
            left: position.x + position.width + 8
          }
        ]}
      />
      <BackdropWithHole
        x={position.x}
        y={position.y}
        width={position.width}
        height={position.height}
        bgColor={theme.backdrop}
        borderRadius={BORDER_RADIUS_PRIMARY}
        borderColor={theme.primaryLight}
        borderWidth={1}
      />
    </>
  ) : null
}

export default React.memo(CongratsFirstCashbackModal)
