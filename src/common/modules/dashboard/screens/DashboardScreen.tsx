import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Image, Pressable, View } from 'react-native'

// @ts-ignore
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import BurgerIcon from '@common/assets/svg/BurgerIcon'
import MaximizeIcon from '@common/assets/svg/MaximizeIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Banners from '@common/components/Banners'
import Button from '@common/components/Button'
import CopyText from '@common/components/CopyText'
import NavIconWrapper from '@common/components/NavIconWrapper'
import NetworkIcon from '@common/components/NetworkIcon'
import Search from '@common/components/Search'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { openInTab } from '@web/extension-services/background/webapi/tab'
import useMainControllerState from '@web/hooks/useMainControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import commonWebStyles from '@web/styles/utils/common'
import shortenAddress from '@web/utils/shortenAddress'
import { getUiType } from '@web/utils/uiType'

import Assets from '../components/Assets'
import DAppFooter from '../components/DAppFooter'
import Routes from '../components/Routes'
import Tabs from '../components/Tabs'
import getStyles from './styles'

// We want to change the query param without refreshing the page.
const handleChangeQuery = (openTab: string) => {
  if (window.location.href.includes('?tab=')) {
    window.history.pushState(null, '', `${window.location.href.split('?')[0]}?tab=${openTab}`)
    return
  }

  window.history.pushState(null, '', `${window.location.href}?tab=${openTab}`)
}

const { isPopup } = getUiType()

const DashboardScreen = () => {
  const { styles, theme } = useTheme(getStyles)
  const route = useRoute()
  const { navigate } = useNavigation()

  const mainCtrl = useMainControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountInfo = mainCtrl.accounts.find((acc) => acc.addr === selectedAccount)

  const { control, watch } = useForm({
    mode: 'all',
    defaultValues: {
      search: ''
    }
  })
  const searchValue = watch('search')

  const [openTab, setOpenTab] = useState(() => {
    const params = new URLSearchParams(route?.search)

    return (params.get('tab') as 'tokens' | 'collectibles') || 'tokens'
  })

  const { accountPortfolio, startedLoading } = usePortfolioControllerState()

  const { t } = useTranslation()

  const tokens = useMemo(
    () =>
      accountPortfolio?.tokens.filter((token) => {
        if (!searchValue) return true

        const doesAddressMatch = token.address.toLowerCase().includes(searchValue.toLowerCase())
        const doesSymbolMatch = token.symbol.toLowerCase().includes(searchValue.toLowerCase())

        return doesAddressMatch || doesSymbolMatch
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accountPortfolio?.tokens?.length, searchValue]
  )

  const networksWithAssets = useMemo(() => {
    const nonZeroBalanceTokens = tokens?.filter((token) => token.amount !== 0n)

    return [...new Set(nonZeroBalanceTokens?.map((token) => token.networkId) || [])]
  }, [tokens])

  useEffect(() => {
    if (searchValue.length > 0 && openTab === 'collectibles') {
      handleChangeQuery('tokens')
      setOpenTab('tokens')
    }
  }, [searchValue, openTab])

  const showView =
    (startedLoading ? Date.now() - startedLoading > 5000 : false) || accountPortfolio?.isAllReady

  if (!showView)
    return (
      <View style={[flexbox.alignCenter]}>
        <Spinner />
      </View>
    )

  // TODO: move that in a separate component in the dashboard folder called: DashboardHeader
  const renderHeaderControls = (
    <View style={[flexbox.directionRow, flexbox.flex1, flexbox.justifySpaceBetween]}>
      <View style={[flexbox.directionRow, flexbox.alignCenter]}>
        <Pressable style={styles.accountButton} onPress={() => navigate('account-select')}>
          <View style={styles.accountButtonInfo}>
            <Image style={styles.accountButtonInfoIcon} source={avatarSpace} resizeMode="contain" />
            <View style={styles.accountAddressAndLabel}>
              {/* TODO: Hide this text element if the account doesn't have a label when labels are properly implemented */}
              <Text weight="medium" fontSize={14}>
                {selectedAccountInfo?.label ? selectedAccountInfo?.label : 'Account Label'}
              </Text>
              <Text weight="regular" style={styles.accountButtonInfoText} fontSize={13}>
                ({shortenAddress(selectedAccount, 14)})
              </Text>
            </View>
          </View>
          <NavIconWrapper
            onPress={() => navigate('account-select')}
            width={25}
            height={25}
            hoverBackground={theme.primaryLight}
            style={styles.accountButtonRightIcon}
          >
            <RightArrowIcon />
          </NavIconWrapper>
        </Pressable>
        <CopyText text={selectedAccount} style={styles.accountCopyIcon} />
      </View>
      <View style={[flexbox.directionRow]}>
        <Button
          textStyle={{ fontSize: 14 }}
          size="small"
          text={t('dApps')}
          hasBottomSpacing={false}
          style={[spacings.mrTy, { width: 85, height: 40 }]}
        />

        {isPopup && (
          <NavIconWrapper
            width={40}
            height={40}
            onPress={() => openInTab('tab.html#/dashboard')}
            style={{ borderColor: colors.scampi_20, ...spacings.mrTy }}
          >
            <MaximizeIcon width={20} height={20} />
          </NavIconWrapper>
        )}
        <NavIconWrapper
          width={40}
          height={40}
          onPress={() => navigate('menu')}
          style={{ borderColor: colors.scampi_20 }}
        >
          <BurgerIcon width={20} height={20} />
        </NavIconWrapper>
      </View>
    </View>
  )

  return (
    <>
      <Header backgroundColor={theme.primaryBackground} mode="custom">
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.flex1,
            commonWebStyles.contentContainer
          ]}
        >
          {renderHeaderControls}
        </View>
      </Header>
      <View style={styles.container}>
        <View style={spacings.phLg}>
          <View style={[styles.contentContainer]}>
            <View style={styles.overview}>
              <View>
                <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                  <Text style={spacings.mbTy}>
                    <Text
                      fontSize={32}
                      shouldScale={false}
                      style={{ lineHeight: 34 }}
                      weight="number_bold"
                    >
                      {t('$')}
                      {Number(
                        accountPortfolio?.totalAmount.toFixed(2).split('.')[0]
                      ).toLocaleString('en-US')}
                    </Text>
                    <Text fontSize={20} shouldScale={false} weight="semiBold">
                      {t('.')}
                      {Number(accountPortfolio?.totalAmount.toFixed(2).split('.')[1])}
                    </Text>
                  </Text>
                </View>
                <View style={styles.networks}>
                  {networksWithAssets.map((networkId, index) => (
                    <View
                      key={networkId}
                      style={[
                        styles.networkIconContainer,
                        { zIndex: networksWithAssets.length - index }
                      ]}
                    >
                      <NetworkIcon style={styles.networkIcon} name={networkId} />
                    </View>
                  ))}
                </View>
              </View>
              <Routes />
            </View>

            <Banners />
          </View>
          <View
            style={[
              styles.contentContainer,
              flexbox.directionRow,
              flexbox.justifySpaceBetween,
              flexbox.alignCenter,
              spacings.mbMd
            ]}
          >
            <Tabs handleChangeQuery={handleChangeQuery} setOpenTab={setOpenTab} openTab={openTab} />
            <Search control={control} height={32} placeholder="Search for tokens" />
          </View>
        </View>
        <View style={[styles.contentContainer, flexbox.flex1]}>
          {tokens && <Assets searchValue={searchValue} openTab={openTab} tokens={tokens} />}
        </View>
        {isPopup && <DAppFooter />}
      </View>
    </>
  )
}

export default DashboardScreen
