import React from 'react'
import { ActivityIndicator, Button, View } from 'react-native'

import { useTranslation } from '@config/localization'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import usePortfolio from '@modules/common/hooks/usePortfolio'
import textStyles from '@modules/common/styles/utils/text'

import styles from './styles'

const Balances = () => {
  const { t } = useTranslation()
  const { areProtocolsLoading, tokens } = usePortfolio()
  const sortedTokens = tokens.sort((a, b) => b.balanceUSD - a.balanceUSD)

  const tokenItem = (index, img, symbol, balance, balanceUSD, address, send = false) => (
    <View key={`token-${address}-${index}`} style={styles.row}>
      <View style={styles.rowItem}>
        <Text>{symbol}</Text>
        {/* TODO: */}
        {/* <div className="icon">
                {
                    failedImg.includes(img) ?
                        <GiToken size={20}/>
                        :
                        <img src={img} draggable="false" alt="Token Icon" onError={() => setFailedImg(failed => [...failed, img])}/>
                }
            </div> */}
      </View>

      <View style={[styles.rowItem, { flex: 1 }]}>
        <Text numberOfLines={1}>{balance}</Text>
        <Text>$ {balanceUSD.toFixed(2)}</Text>
      </View>

      <View style={styles.rowItem}>
        <Text>{symbol}</Text>
      </View>
      {/* TODO: */}
      {/* {
                send ?
                    <div className="actions">
                        <NavLink to={`/wallet/transfer/${address}`}>
                            <Button small icon={<AiOutlineSend/>}>Send</Button>
                        </NavLink>
                    </div>
                    :
                    null
            } */}
    </View>
  )

  return (
    <View>
      <Title>{t('Tokens')}</Title>

      {areProtocolsLoading ? (
        <ActivityIndicator />
      ) : (
        sortedTokens.map(({ address, symbol, tokenImageUrl, balance, balanceUSD }, i) =>
          tokenItem(i, tokenImageUrl, symbol, balance, balanceUSD, address, true)
        )
      )}
    </View>
  )
}

export default Balances
