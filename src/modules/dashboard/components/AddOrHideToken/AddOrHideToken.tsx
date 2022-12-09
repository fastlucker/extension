import { NetworkId, NetworkType } from 'ambire-common/src/constants/networks'
import { UseAccountsReturnType } from 'ambire-common/src/hooks/useAccounts'
import { Token } from 'ambire-common/src/hooks/usePortfolio'
import { UsePortfolioReturnType } from 'ambire-common/src/hooks/usePortfolio/types'
import React, { useState } from 'react'
import { LayoutAnimation, TouchableOpacity, View } from 'react-native'
import { useModalize } from 'react-native-modalize'

import { useTranslation } from '@config/localization'
import BottomSheet from '@modules/common/components/BottomSheet'
import Segments from '@modules/common/components/Segments'
import Text from '@modules/common/components/Text'
import Title from '@modules/common/components/Title'
import { triggerLayoutAnimation } from '@modules/common/services/layoutAnimation'
import spacings from '@modules/common/styles/spacings'
import flexboxStyles from '@modules/common/styles/utils/flexbox'
import textStyles from '@modules/common/styles/utils/text'

import AddOrHideTokenForm from './AddOrHideTokenForm'
import { MODES } from './constants'
import HiddenOrExtraTokens from './HiddenOrExtraTokens'
import styles from './styles'

const segments = [{ value: MODES.ADD_TOKEN }, { value: MODES.HIDE_TOKEN }]

interface Props {
  tokens: UsePortfolioReturnType['tokens']
  extraTokens: UsePortfolioReturnType['extraTokens']
  hiddenTokens: UsePortfolioReturnType['hiddenTokens']
  networkId?: NetworkId
  networkRpc?: NetworkType['rpc']
  networkName?: NetworkType['name']
  selectedAcc: UseAccountsReturnType['selectedAcc']
  onAddExtraToken: UsePortfolioReturnType['onAddExtraToken']
  onAddHiddenToken: UsePortfolioReturnType['onAddHiddenToken']
  onRemoveExtraToken: UsePortfolioReturnType['onRemoveExtraToken']
  onRemoveHiddenToken: UsePortfolioReturnType['onRemoveHiddenToken']
}

const AddOrHideToken = ({
  tokens,
  extraTokens,
  hiddenTokens,
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

  const { ref: sheetRef, open: openBottomSheet, close: closeBottomSheet } = useModalize()

  const [formType, setFormType] = useState<MODES>(MODES.ADD_TOKEN)

  const handleOnSubmit = (token: Token, formMode: MODES) => {
    const cases: { [key in MODES]: () => void } = {
      [MODES.ADD_TOKEN]: () => {
        onAddExtraToken(token)
        closeBottomSheet()
      },
      [MODES.HIDE_TOKEN]: () => {
        onAddHiddenToken(token)
        closeBottomSheet()
      }
    }

    return cases[formMode]()
  }

  return (
    <>
      <TouchableOpacity style={[styles.btnContainer, spacings.mbTy]} onPress={openBottomSheet}>
        <Text fontSize={16}>{t('Add or Hide Token')}</Text>
      </TouchableOpacity>

      <BottomSheet id="add-token" sheetRef={sheetRef} closeBottomSheet={closeBottomSheet}>
        <Segments
          defaultValue={formType}
          segments={segments}
          onChange={(value: MODES) => {
            setFormType(value)
            // FIXME: This breaks the bottom sheet backdrop
            triggerLayoutAnimation({
              forceAnimate: true,
              config: LayoutAnimation.create(300, 'linear', 'opacity')
            })
          }}
          fontSize={14}
        />
        <View style={[flexboxStyles.flex1, flexboxStyles.justifyEnd, spacings.mtMd]}>
          {formType === MODES.ADD_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Add Token')}
              </Title>

              <AddOrHideTokenForm
                mode={MODES.ADD_TOKEN}
                onSubmit={handleOnSubmit}
                tokens={tokens}
                extraTokens={extraTokens}
                hiddenTokens={hiddenTokens}
                networkId={networkId}
                networkRpc={networkRpc}
                networkName={networkName}
                selectedAcc={selectedAcc}
              />
              <HiddenOrExtraTokens
                mode={MODES.ADD_TOKEN}
                hiddenTokens={hiddenTokens}
                extraTokens={extraTokens}
                onRemoveExtraToken={onRemoveExtraToken}
                onRemoveHiddenToken={onRemoveHiddenToken}
              />
            </>
          )}
          {formType === MODES.HIDE_TOKEN && (
            <>
              <Title type="small" style={textStyles.center}>
                {t('Hide Token')}
              </Title>

              <AddOrHideTokenForm
                enableSymbolSearch
                mode={MODES.HIDE_TOKEN}
                onSubmit={handleOnSubmit}
                tokens={tokens}
                extraTokens={extraTokens}
                hiddenTokens={hiddenTokens}
                networkId={networkId}
                networkRpc={networkRpc}
                networkName={networkName}
                selectedAcc={selectedAcc}
              />
              <HiddenOrExtraTokens
                mode={MODES.HIDE_TOKEN}
                hiddenTokens={hiddenTokens}
                extraTokens={extraTokens}
                onRemoveExtraToken={onRemoveExtraToken}
                onRemoveHiddenToken={onRemoveHiddenToken}
              />
            </>
          )}
        </View>
      </BottomSheet>
    </>
  )
}

export default AddOrHideToken
