import React, { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import { Network } from '@ambire-common/interfaces/network'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { SubmittedAccountOp } from '@ambire-common/libs/accountOp/submittedAccountOp'
import RepeatIcon from '@common/assets/svg/RepeatIcon'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'

type Props = {
  accountAddr: string
  networkId: Network['id']
  rawCalls: SubmittedAccountOp['calls']
  textSize: number
  text?: string
}

const RepeatTransaction: FC<Props> = ({ text, accountAddr, networkId, rawCalls, textSize }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const handleRepeatTransaction = useCallback(() => {
    if (!rawCalls) return
    const userTx = {
      kind: 'calls' as const,
      calls: rawCalls
    }

    const userRequest: UserRequest = {
      id: new Date().getTime(),
      action: userTx,
      meta: {
        isSignAction: true,
        networkId,
        accountAddr
      }
    }

    dispatch({
      type: 'MAIN_CONTROLLER_ADD_USER_REQUEST',
      params: userRequest
    })
  }, [accountAddr, dispatch, networkId, rawCalls])

  return (
    <TouchableOpacity
      style={[flexbox.directionRow, flexbox.alignCenter]}
      onPress={handleRepeatTransaction}
    >
      <Text fontSize={textSize} appearance="secondaryText" weight="medium" style={spacings.mrMi}>
        {text || t('Repeat Transaction')}
      </Text>
      <RepeatIcon
        width={textSize}
        height={textSize}
        color={theme.secondaryText}
        style={spacings.mrMi}
        strokeWidth={2}
      />
    </TouchableOpacity>
  )
}

export default RepeatTransaction
