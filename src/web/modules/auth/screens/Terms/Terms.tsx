import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import AmbireLogo from '@common/assets/svg/AmbireLogo'
import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings, { SPACING, SPACING_LG, SPACING_SM } from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'

import styles from './style'

export const TERMS_VERSION = '1.0.0'

const Terms = () => {
  const { t } = useTranslation()
  const { params } = useRoute()
  const [isChecked, setIsChecked] = useState(false)
  const { navigate, goBack } = useNavigation()
  const keystoreState = useKeystoreControllerState()
  const { flow }: any = params
  const { theme } = useTheme()

  useEffect(() => {
    ;(async () => {
      const hasTerms = await storage.get('termsState', false)
      if (hasTerms) {
        navigate(WEB_ROUTES.getStarted)
      }
    })()
  }, [])

  useEffect(() => {
    if (!flow) {
      navigate(WEB_ROUTES.getStarted)
    }
  }, [flow, navigate])

  const handleAcceptTerms = async () => {
    await storage.set('termsState', {
      version: TERMS_VERSION,
      acceptedAt: Date.now()
    })

    if (flow === 'view-only') {
      navigate(WEB_ROUTES.viewOnlyAccountAdder)
      return
    }
    if (!keystoreState.isReadyToStoreKeys && flow !== 'hw') {
      navigate(WEB_ROUTES.keyStoreSetup, { state: { backTo: WEB_ROUTES.getStarted, flow } })
      return
    }
    if (flow === 'email') {
      navigate(WEB_ROUTES.createEmailVault, {
        state: { backTo: WEB_ROUTES.getStarted, flow: 'email' }
      })
      return
    }
    if (flow === 'hw') {
      navigate(WEB_ROUTES.hardwareWalletSelect, { state: { backTo: WEB_ROUTES.getStarted } })
      return
    }
    if (flow === 'legacy') {
      navigate(WEB_ROUTES.externalSigner, {
        state: { backTo: WEB_ROUTES.getStarted, flow: 'legacy' }
      })
    }
  }

  return (
    <TabLayoutContainer
      width="md"
      footer={
        <>
          <BackButton onPress={goBack} />
          <Button
            disabled={!isChecked}
            textStyle={{ fontSize: 14 }}
            text={t('Continue')}
            hasBottomSpacing={false}
            onPress={handleAcceptTerms}
          >
            <View style={spacings.pl}>
              <RightArrowIcon color={colors.titan} />
            </View>
          </Button>
        </>
      }
    >
      <TabLayoutWrapperMainContent>
        <View style={[flexbox.alignSelfCenter, { maxWidth: 620 }]}>
          <View style={[flexbox.alignCenter]}>
            <AmbireLogo style={styles.logo} />
            <Text fontSize={32} weight="regular" style={[{ textAlign: 'center' }, spacings.mbXl]}>
              {t('Terms Of Service')}
            </Text>
          </View>
          <Text style={[styles.text, styles.bold]}>{t('Effective starting 26 November 2021')}</Text>
          <Text style={styles.text}>
            <Text style={styles.text}>
              {t('Ambire Wallet is an open-source non-custodial cryptocurrency wallet:')}
            </Text>
            <ul style={{ paddingLeft: SPACING_SM, margin: 0 }}>
              <li>
                open-source: the software is provided &quot;as is&quot;, without warranty of any
                kind, express or implied, including but not limited to the warranties of
                merchantability, fitness for a particular purpose and noninfringement
              </li>
              <li>
                non-custodial: it is designed such that each user account is solely controlled by
                whoever holds the associated private keys. In other words, the end user retains full
                custody (possession) of their crypto funds at all times. As such, loss of funds is
                possible if the end user loses control over their private keys, for example but not
                limited to: losing their passphrase, losing access to their JSON backup, etc. The
                end user is solely responsible for the control over their private keys.
              </li>
            </ul>
          </Text>
          <Text style={styles.text}>
            {t(
              'Those characteristics, combined with the decentralized nature of blockchain technologies such as Ethereum, mean that no single party is able to freeze, repossess or in any other way control the funds and actions of end users.'
            )}
          </Text>
          <Text style={styles.text}>
            {t(
              'By using Ambire Wallet, you agree not to hold it&apos;s contributors and authors financially accountable for any loss of funds resulting from user error, software error, unauthorized access (hacks), or otherwise.'
            )}
          </Text>
          <Text style={styles.text}>
            {t(
              'Ambire Wallet contributors, authors and operators do not offer any business or investment advice. The content of the Ambire Wallet is not intended to be used as a guide for crypto-asset investments or signing of other legal agreements in connection to crypto-assets.'
            )}
          </Text>
          <Text style={[styles.text, { marginBottom: SPACING * 2 }]}>
            {t(
              'Ambire Wallet contributors, authors and operators shall not be held accountable for any actions performed by end users.\nAs open-source software, the Ambire Wallet source code can be copied locally and/or ran by any party, and as such it does not depend on any operators or service providers. Any party may copy and develop the source code resulting in the formation of a distinct and separate software. The creation of forks cannot be avoided and end users are solely responsible for any losses and/or damages resulting from the use of forks. The end users are solely responsible and liable for any and all of your actions and inactions on the application and all gains and losses sustained from their use of the Ambire Wallet. The end user hereby indemnifies Ambire Wallet contributors, authors and operators in full for any and all negative consequences that might arise from the use of the application due to the lack of control over the peer-to-peer activities. Due to the permissionless and decentralized nature, the access to the Ambire Wallet is granted worldwide. The use of the Wallet, however, may be legally prohibited or technically restricted in certain territories and countries. End users are solely responsible to inform themselves of such legal restrictions and to comply with the legal norms applicable for them. Technically speaking, due to the open-source nature of Ambire Wallet, access to your funds will always be possible as long as you retain access to any of the private keys controlling the account. The activities conducted by the end users on the Wallet may result in the creation of a taxable event and end users may be objects of tax and fee payments to public authorities in different countries depending on the legal regulations. End users are obliged to inform themselves about such requirements and are solely responsible for their payments.'
            )}
          </Text>
          <Checkbox
            style={{ marginBottom: SPACING_LG * 2 }}
            value={isChecked}
            onValueChange={setIsChecked}
            uncheckedBorderColor={theme.primaryText}
            label={t('I agree to the Terms of Service and Privacy Policy.')}
          />
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default Terms
