import { ethers } from 'ethers'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, BackHandler, Image, TouchableOpacity, View } from 'react-native'

import LeftArrowIcon from '@assets/svg/LeftArrowIcon'
import { useTranslation } from '@config/localization'
import Button from '@modules/common/components/Button'
import NavIconWrapper from '@modules/common/components/NavIconWrapper'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import Select from '@modules/common/components/Select'
import Text from '@modules/common/components/Text'
import TokenIcon from '@modules/common/components/TokenIcon'
import useNetwork from '@modules/common/hooks/useNetwork'
import {
  LINEAR_OPACITY_ANIMATION,
  triggerLayoutAnimation
} from '@modules/common/services/layoutAnimation'
import { colorPalette as colors } from '@modules/common/styles/colors'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'
import { CardsVisibilityContext } from '@modules/earn/contexts/cardsVisibilityContext'

import styles from './styles'

type Segment = 'Deposit' | 'Withdraw'

const Card = ({
  name,
  loading,
  unavailable,
  tokensItems,
  icon,
  details,
  onTokenSelect,
  onValidate,
  warning,
  areDepositsDisabled
}: any) => {
  const [segment, setSegment] = useState<Segment>('Deposit')
  const { network }: any = useNetwork()
  const [tokens, setTokens] = useState<any>([])
  const [token, setToken] = useState<any>()
  const [amount, setAmount] = useState<any>(0)
  const [disabled, setDisabled] = useState<any>(true)
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const { visibleCard, setVisibleCard } = useContext(CardsVisibilityContext)

  useEffect(() => {
    if (!isExpanded) {
      return
    }

    const backAction = () => {
      if (isExpanded) {
        triggerLayoutAnimation({
          config: LINEAR_OPACITY_ANIMATION,
          forceAnimate: true
        })
        setIsExpanded(false)
        setVisibleCard(null)
        // Returning true prevents execution of the default native back handling
        return true
      }

      return false
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [isExpanded])

  const expand = () => {
    triggerLayoutAnimation({
      config: LINEAR_OPACITY_ANIMATION,
      forceAnimate: true
    })
    setVisibleCard(name)
    setIsExpanded(true)
  }

  const collapse = () => {
    triggerLayoutAnimation({
      config: LINEAR_OPACITY_ANIMATION,
      forceAnimate: true
    })
    setVisibleCard(null)
    setIsExpanded(false)
  }

  const currentToken = useMemo(
    () => tokens.find(({ value }: any) => value === token),
    [token, tokens]
  )

  // Sort tokens items by balance
  const getEquToken = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (token) =>
      tokensItems.find(
        ({ address, type }: any) =>
          address === token.address &&
          (token.type === 'deposit' ? type === 'withdraw' : type === 'deposit')
      ),
    [tokensItems]
  )
  const sortedTokenItems = useMemo(
    () =>
      [...tokensItems].sort(
        (a: any, b: any) =>
          // eslint-disable-next-line no-unsafe-optional-chaining
          b?.balance + getEquToken(b)?.balance - (a?.balance + getEquToken(a)?.balance)
      ),
    [tokensItems, getEquToken]
  )

  const getMaxAmount = () => {
    if (!currentToken) return 0
    const { balanceRaw, decimals } = currentToken
    return ethers.utils.formatUnits(balanceRaw, decimals)
  }

  const setMaxAmount = () => setAmount(getMaxAmount())

  useEffect(() => {
    if (segment === 'Deposit') setTokens(sortedTokenItems.filter(({ type }) => type === 'deposit'))
    if (segment === 'Withdraw')
      setTokens(sortedTokenItems.filter(({ type }) => type === 'withdraw'))
  }, [segment, sortedTokenItems])

  useEffect(() => {
    setAmount(0)
  }, [token, segment])

  useEffect(() => {
    onTokenSelect(token)
    setDisabled(!token || !tokens.length)
  }, [token, onTokenSelect, tokens.length])

  const assetsItems = useMemo(
    () =>
      tokens.map(({ label, symbol, value, icon, address }: any) => ({
        label: label || symbol,
        value,
        icon: () => <TokenIcon withContainer uri={icon} networkId={network?.id} address={address} />
      })),
    [tokens]
  )

  useEffect(() => {
    if (assetsItems.length && !token) setToken(assetsItems[0]?.value)
  }, [assetsItems])

  const amountLabel = (
    <View style={[flexboxStyles.directionRow, spacings.mbMi]}>
      <Text style={spacings.mr}>{t('Available Amount:')}</Text>

      <View style={[flexboxStyles.directionRow, flexboxStyles.flex1]}>
        <Text numberOfLines={1} style={{ flex: 1, textAlign: 'right' }} ellipsizeMode="tail">
          {!disabled ? `${getMaxAmount()}` : '0.0'}
        </Text>
        {currentToken && <Text>{` ${currentToken?.symbol}`}</Text>}
      </View>
    </View>
  )

  useEffect(() => {
    if (loading) setToken(null)
  }, [loading])

  const expandedContent = (
    <>
      {!!loading && <ActivityIndicator />}
      {!loading && !!unavailable && (
        <Text style={[textStyles.center, spacings.pvSm]}>{t('Unavailable on this Network')}</Text>
      )}
      {!loading && !unavailable && (
        <View>
          <Select
            value={token}
            items={assetsItems}
            setValue={setToken}
            containerPropsStyle={spacings.mbSm}
            // TODO:
            //  disabled={disabled}
            label={t('Choose Token')}
          />
          {warning && <View style={spacings.mbMd}>{warning}</View>}
          <View style={[flexboxStyles.directionRow, spacings.mbTy]}>
            <View style={[flexboxStyles.flex1, spacings.prTy]}>
              <Button
                text={t('Deposit')}
                textStyle={[
                  segment === 'Deposit' ? { color: colors.titan } : { color: colors.waikawaGray },
                  { fontSize: 14 }
                ]}
                type={segment === 'Deposit' ? 'outline' : 'secondary'}
                onPress={() => setSegment('Deposit')}
                disabled={areDepositsDisabled}
              />
            </View>
            <View style={[flexboxStyles.flex1, spacings.plTy]}>
              <Button
                text={t('Withdraw')}
                textStyle={[
                  segment === 'Withdraw' ? { color: colors.titan } : { color: colors.waikawaGray },
                  { fontSize: 14 }
                ]}
                type={segment === 'Withdraw' ? 'outline' : 'secondary'}
                onPress={() => setSegment('Withdraw')}
              />
            </View>
          </View>
          <NumberInput
            onChangeText={setAmount}
            keyboardType="numeric"
            autoCorrect={false}
            value={amount.toString()}
            button={t('MAX')}
            onButtonPress={setMaxAmount}
            disabled={Number(currentToken?.balance || 0) === 0}
            labelComponent={amountLabel}
          />
          <Button
            disabled={disabled || amount <= 0 || amount > Number(currentToken?.balance || 0)}
            onPress={() => onValidate(segment, token, amount)}
            text={segment}
          />
          {!disabled && (
            <View style={spacings.pt}>
              <Text style={spacings.mbTy} fontSize={16} color={colors.baileyBells} weight="medium">
                {t('Details')}
              </Text>
              <View>
                {details.map(([type, value]: any, idx: number) => (
                  <View
                    key={type + value}
                    style={[
                      styles.detailsItem,
                      idx !== details.length - 1 && { borderBottomWidth: 1 }
                    ]}
                  >
                    <Text
                      weight="medium"
                      style={[flexboxStyles.flex1, spacings.prTy]}
                      numberOfLines={1}
                    >
                      {type}
                    </Text>
                    <Text color={colors.baileyBells}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </>
  )

  return (
    <View>
      <Panel
        type="filled"
        style={[
          !isExpanded && { minHeight: 120 },
          !!visibleCard && visibleCard !== name && { display: 'none' }
        ]}
      >
        <View
          style={[
            !isExpanded && flexboxStyles.flex1,
            isExpanded && { width: '100%', marginBottom: 40 }
          ]}
        >
          {isExpanded && (
            <NavIconWrapper style={styles.backButton} onPress={collapse}>
              <LeftArrowIcon />
            </NavIconWrapper>
          )}
          <TouchableOpacity
            style={[
              flexboxStyles.alignCenter,
              isExpanded && spacings.ptMi,
              !isExpanded && flexboxStyles.flex1,
              !isExpanded && flexboxStyles.justifyCenter
            ]}
            activeOpacity={isExpanded ? 1 : 0.7}
            onPress={() => (isExpanded ? null : expand())}
          >
            {!!icon && <Image source={icon} />}
          </TouchableOpacity>
        </View>
        {isExpanded && expandedContent}
      </Panel>
    </View>
  )
}

export default Card
