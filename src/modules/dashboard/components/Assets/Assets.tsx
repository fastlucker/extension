import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Path, Svg } from 'react-native-svg'

import { useTranslation } from '@config/localization'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import Panel from '@modules/common/components/Panel'
import Text from '@modules/common/components/Text'
import colors from '@modules/common/styles/colors'

import Tokens from '../Tokens'
import styles from './styles'

interface Props {
  tokens: UsePortfolioReturnType['tokens']
  extraTokens: UsePortfolioReturnType['extraTokens']
  hiddenTokens: UsePortfolioReturnType['hiddenTokens']
  protocols: UsePortfolioReturnType['protocols']
  isLoading: boolean
  explorerUrl?: NetworkType['explorerUrl']
  networkId?: NetworkId
  networkRpc?: NetworkType['rpc']
  networkName?: NetworkType['name']
  selectedAcc: UseAccountsReturnType['selectedAcc']
  onAddExtraToken: UsePortfolioReturnType['onAddExtraToken']
  onAddHiddenToken: UsePortfolioReturnType['onAddHiddenToken']
  onRemoveExtraToken: UsePortfolioReturnType['onRemoveExtraToken']
  onRemoveHiddenToken: UsePortfolioReturnType['onRemoveHiddenToken']
}

const Assets = ({
  tokens,
  extraTokens,
  hiddenTokens,
  protocols,
  isLoading,
  explorerUrl,
  networkId,
  networkRpc,
  networkName,
  selectedAcc,
  onAddExtraToken,
  onAddHiddenToken,
  onRemoveExtraToken,
  onRemoveHiddenToken
}: Props) => {
  const { t } = useTranslation()
  const [type, setType] = useState<'assets' | 'collectibles'>('assets')

  return (
    <View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleItem,
            type === 'assets' && {
              backgroundColor: colors.valhalla
            }
          ]}
          onPress={() => setType('assets')}
        >
          <Text
            fontSize={16}
            weight="regular"
            color={type === 'assets' ? colors.titan : colors.chetwode}
          >
            Assets
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: '100%',
            position: 'absolute',
            justifyContent: 'flex-end',
            left: '50%',
            transform: [{ translateX: type === 'collectibles' ? -13 : 0 }]
          }}
        >
          <Svg
            width={13}
            height={13}
            style={{
              transform: [{ rotate: type === 'assets' ? '90deg' : '0deg' }]
            }}
          >
            <Path
              fill={colors.valhalla}
              stroke={colors.valhalla}
              d="M13 0 V13 H0 V13 Q13 13 13 0"
            />
          </Svg>
        </View>
        <TouchableOpacity
          style={[
            styles.toggleItem,
            type === 'collectibles' && {
              backgroundColor: colors.valhalla
            }
          ]}
          onPress={() => setType('collectibles')}
        >
          <Text
            fontSize={16}
            weight="regular"
            color={type === 'collectibles' ? colors.titan : colors.chetwode}
          >
            Collectibles
          </Text>
        </TouchableOpacity>
      </View>
      <Panel
        style={{
          borderTopStartRadius: type === 'assets' ? 0 : 13,
          borderTopEndRadius: type === 'collectibles' ? 0 : 13
        }}
      >
        <Tokens
          tokens={tokens}
          extraTokens={extraTokens}
          hiddenTokens={hiddenTokens}
          protocols={protocols}
          isLoading={isLoading}
          explorerUrl={explorerUrl}
          networkId={networkId}
          networkRpc={networkRpc}
          networkName={networkName}
          selectedAcc={selectedAcc}
          onAddExtraToken={onAddExtraToken}
          onAddHiddenToken={onAddHiddenToken}
          onRemoveExtraToken={onRemoveExtraToken}
          onRemoveHiddenToken={onRemoveHiddenToken}
        />
      </Panel>
    </View>
  )
}

export default React.memo(Assets)
