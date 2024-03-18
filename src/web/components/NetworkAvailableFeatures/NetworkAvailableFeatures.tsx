/* eslint-disable jsx-a11y/anchor-is-valid */
import { Interface } from 'ethers'
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { NetworkDescriptor, NetworkFeature } from '@ambire-common/interfaces/networkDescriptor'
import { UserRequest } from '@ambire-common/interfaces/userRequest'
import { isSmartAccount } from '@ambire-common/libs/account/account'
import CheckIcon from '@common/assets/svg/CheckIcon'
import ErrorFilledIcon from '@common/assets/svg/ErrorFilledIcon'
import InformationIcon from '@common/assets/svg/InformationIcon'
import WarningFilledIcon from '@common/assets/svg/WarningFilledIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import Tooltip from '@common/components/Tooltip'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import useToast from '@common/hooks/useToast'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

import { deployContractsBytecode } from './oldDeployParams'

type Props = {
  networkId: NetworkDescriptor['id']
  features: NetworkFeature[] | undefined
}

const NetworkAvailableFeatures = ({ networkId, features }: Props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { pathname } = useRoute()
  const { selectedAccount, accounts } = useMainControllerState()
  const { networks } = useSettingsControllerState()
  const { dispatch } = useBackgroundService()
  const { addToast } = useToast()

  const selectedNetwork = useMemo(
    () => networks.find((network) => network.id === networkId),
    [networks, networkId]
  )

  const handleDeploy = async () => {
    if (!selectedNetwork) return // this should not happen...

    const account = accounts.filter((acc) => acc.addr === selectedAccount)[0]
    // we need a basic account
    if (isSmartAccount(account) || !account) {
      addToast(
        'Deploy cannot be made with a smart account. Please select a basic account and try again',
        { type: 'error' }
      )
      return
    }

    // MAJOR TODO<BOBBY>:
    // Currently, we support the old smart accounts that do not have the latest
    // ambire contracts code. To have the same contracts accross networks, we
    // need to deploy not the latest, but a cached version of our contracts.
    // Once the final version of the contracts comes, we have to fix this
    // const bytecode = DeployHelper.bin
    const bytecode = deployContractsBytecode
    const salt = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const singletonAddr = '0xce0042B868300000d44A59004Da54A005ffdcf9f'
    const singletonABI = [
      {
        inputs: [
          { internalType: 'bytes', name: '_initCode', type: 'bytes' },
          { internalType: 'bytes32', name: '_salt', type: 'bytes32' }
        ],
        name: 'deploy',
        outputs: [{ internalType: 'address payable', name: 'createdContract', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ]
    const singletonInterface = new Interface(singletonABI)
    const txn = {
      kind: 'call' as const,
      to: singletonAddr,
      value: 0n,
      data: singletonInterface.encodeFunctionData('deploy', [bytecode, salt])
    }

    const userRequest: UserRequest = {
      id: new Date().getTime(),
      networkId: selectedNetwork.id,
      accountAddr: selectedAccount as string,
      forceNonce: null,
      action: txn
    }

    dispatch({ type: 'MAIN_CONTROLLER_ADD_USER_REQUEST', params: userRequest })
  }

  return (
    <View style={[spacings.pbLg, spacings.pr]}>
      <Text fontSize={18} weight="medium" style={spacings.mbMd}>
        {t('Available features')}
      </Text>
      <View>
        {!!features &&
          features.map((feature) => {
            return (
              <View key={feature.id} style={[flexbox.directionRow, spacings.mb]}>
                <View style={[spacings.mrTy, { marginTop: 3 }]}>
                  {feature.level === 'loading' && <Spinner style={{ width: 14, height: 14 }} />}
                  {feature.level === 'success' && <CheckIcon width={14} height={14} />}
                  {feature.level === 'warning' && <WarningFilledIcon width={14} height={14} />}
                  {feature.level === 'danger' && <ErrorFilledIcon width={14} height={14} />}
                </View>
                <View style={[flexbox.directionRow, flexbox.flex1, flexbox.alignCenter]}>
                  <Text
                    fontSize={14}
                    weight="medium"
                    appearance="secondaryText"
                    style={{ ...spacings.mrTy, overflow: 'visible' }}
                    numberOfLines={2}
                  >
                    {feature.title}
                    {pathname?.includes(ROUTES.networksSettings) &&
                      feature.id === 'saSupport' &&
                      feature.level === 'warning' && (
                        <>
                          {'  '}
                          <Text
                            weight="medium"
                            underline
                            fontSize={14}
                            color={theme.primary}
                            onPress={handleDeploy}
                          >
                            {t('Deploy Contracts')}
                          </Text>
                        </>
                      )}
                    {!!feature.msg && (
                      <View style={{ width: 1 }}>
                        <View style={{ position: 'absolute', top: -11.5, left: 8 }}>
                          <InformationIcon
                            width={14}
                            height={14}
                            data-tooltip-id="feature-message-tooltip"
                            data-tooltip-content={feature.msg}
                          />
                        </View>
                      </View>
                    )}
                  </Text>
                </View>
              </View>
            )
          })}
        <Tooltip id="feature-message-tooltip" />
      </View>
    </View>
  )
}

export default React.memo(NetworkAvailableFeatures)
