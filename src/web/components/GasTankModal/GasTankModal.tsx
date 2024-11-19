import { formatUnits } from 'ethers'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { Account } from '@ambire-common/interfaces/account'
import { SelectedAccountPortfolio } from '@ambire-common/interfaces/selectedAccount'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import { TokenResult } from '@ambire-common/libs/portfolio'
import GasTankIcon from '@common/assets/svg/GasTankIcon'
import TopUpIcon from '@common/assets/svg/TopUpIcon'
import Alert from '@common/components/Alert'
import BottomSheet from '@common/components/BottomSheet'
import ModalHeader from '@common/components/BottomSheet/ModalHeader'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import { createTab } from '@web/extension-services/background/webapi/tab'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

type Props = {
  modalRef: any
  handleClose: () => void
  portfolio: SelectedAccountPortfolio
  account: Account | null
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
  const { styles } = useTheme(getStyles)
  const { addToast } = useToast()
  const { t } = useTranslation()
  const { navigate } = useNavigation()

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

  return (
    <BottomSheet
      id="gas-tank-modal"
      type="modal"
      sheetRef={modalRef}
      backgroundColor="primaryBackground"
      containerInnerWrapperStyles={styles.containerInnerWrapper}
      closeBottomSheet={handleClose}
    >
      <View style={styles.content}>
        <ModalHeader handleClose={handleClose} withBackButton={isPopup} title="Gas Tank" />
        <View>
          <View style={styles.descriptionTextWrapper}>
            <Text fontSize={14}>
              {t(
                'The Ambire Gas Tank is your special account for paying gas and saving on gas fees. By filling up your Gas Tank, you are setting aside, or prepaying for network fees. You can add more tokens to your Gas Tank at any time.'
              )}
            </Text>
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
              <Text appearance="primary" fontSize={14} underline>
                {t('Learn more >')}
              </Text>
            </Pressable>
          </View>
          <View style={styles.balancesWrapper}>
            {!isSA && <View style={styles.overlay} />}

            <View style={{ ...flexbox.alignStart }}>
              <Text fontSize={12} appearance="secondaryText" style={{ ...spacings.pbTy }}>
                {t('Gas Tank Balance')}
              </Text>
              <View style={{ ...flexbox.directionRow, ...flexbox.alignCenter }}>
                <GasTankIcon width={32} />
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
        </View>
        {!isSA && (
          <Alert
            type="info"
            isTypeLabelHidden
            style={spacings.mtXl}
            title={t('Info')}
            titleWeight="semiBold"
            text={t(
              'The Gas Tank feature is not available for Basic Accounts. If you want to use the full potential of the Gas Tank, create a Smart Account.'
            )}
          />
        )}
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          type="primary"
          text={isSA ? t('Top Up Gas Tank') : t('Create Smart Account')}
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

export default GasTankModal
