import { ethers } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import Button from '@modules/common/components/Button'
import NumberInput from '@modules/common/components/NumberInput'
import Panel from '@modules/common/components/Panel'
import Select from '@modules/common/components/Select'
import Text from '@modules/common/components/Text'

const segments = [{ value: 'Deposit' }, { value: 'Withdraw' }]

const Card = ({
  loading,
  unavailable,
  tokensItems,
  icon,
  details,
  onTokenSelect,
  onValidate
}: any) => {
  const [segment, setSegment] = useState<any>(segments[0].value)
  const [tokens, setTokens] = useState<any>([])
  const [token, setToken] = useState<any>()
  const [amount, setAmount] = useState<any>(0)
  const [disabled, setDisabled] = useState<any>(true)

  const currentToken = tokens.find(({ value }: any) => value === token)

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
    if (segment === segments[0]?.value)
      setTokens(sortedTokenItems.filter(({ type }) => type === 'deposit'))
    if (segment === segments[1]?.value)
      setTokens(sortedTokenItems.filter(({ type }) => type === 'withdraw'))
  }, [segment, sortedTokenItems])

  useEffect(() => setAmount(0), [token, segment])

  useEffect(() => {
    onTokenSelect(token)
    setDisabled(!token || !tokens.length)
  }, [token, onTokenSelect, tokens.length])

  const amountLabel = (
    <View>
      <Text>
        Available Amount:{' '}
        <span>{!disabled ? `${getMaxAmount()} ${currentToken?.symbol}` : '0'}</span>
      </Text>
    </View>
  )

  return (
    <Panel>
      <View>{/* <img src={icon} alt="Icon" /> */}</View>
      {!!loading && <ActivityIndicator />}
      {!loading && !!unavailable && <Text>Unavailable on this Network</Text>}
      {!loading && !unavailable && (
        <View>
          {/* TODO: */}
          <Select
            searchable
            disabled={disabled}
            label="Choose Token"
            defaultValue={token}
            items={tokens}
            onChange={(value: any) => setToken(value)}
          />
          {!disabled ? (
            <View>
              {details.map(([type, value]: any) => (
                <View key={type}>
                  <Text>
                    {type} {value}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <View />
              <View />
              <View />
            </View>
          )}
          {/* <Segments
            small
            defaultValue={segment}
            segments={segments}
            onChange={(value) => setSegment(value)}
          /> */}

          <NumberInput
            disabled={!currentToken?.balance}
            min="0"
            max={currentToken?.balance}
            value={amount}
            // label={amountLabel}
            onInput={(value) => setAmount(value)}
            button="MAX"
            onButtonClick={setMaxAmount}
          />
          <View className="separator" />
          <Button
            disabled={disabled || amount <= 0 || amount > currentToken?.balance}
            // icon={segment === segments[0].value ? <BsArrowDownSquare /> : <BsArrowUpSquare />}
            onPress={() => onValidate(segment, token, amount)}
            text={segment}
          />
        </View>
      )}
    </Panel>
  )
}

export default Card
