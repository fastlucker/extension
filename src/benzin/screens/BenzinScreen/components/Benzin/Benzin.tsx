import { randomBytes } from 'ethers'
import React, { useMemo } from 'react'
import { ImageBackground, ScrollView, View } from 'react-native'

// @ts-ignore
import meshGradientLarge from '@benzin/assets/images/mesh-gradient-large.png'
// @ts-ignore
import meshGradient from '@benzin/assets/images/mesh-gradient.png'
import Buttons from '@benzin/screens/BenzinScreen/components/Buttons'
import Header from '@benzin/screens/BenzinScreen/components/Header'
import Steps from '@benzin/screens/BenzinScreen/components/Steps'
import useBenzin from '@benzin/screens/BenzinScreen/hooks/useBenzin'
import OpenIcon from '@common/assets/svg/OpenIcon'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import TransactionSummary from '@web/modules/sign-account-op/components/TransactionSummary'

import { IS_MOBILE_UP_BENZIN_BREAKPOINT } from '../../styles'
import getStyles from './styles'

const Benzin = ({ state }: { state: ReturnType<typeof useBenzin> }) => {
  const { styles } = useTheme(getStyles)
  const { maxWidthSize } = useWindowSize()

  const summary = useMemo(() => {
    if (!state || !state.stepsState) return []
    const calls = state.stepsState.calls
    if (!calls) return []

    // if there's an userOpHash & txnId but no callData decoded,
    // it means handleOps has not been called directly and we cannot decode
    // the data correctly
    if (
      state.txnId &&
      state.userOpHash &&
      state.stepsState.userOp &&
      state.stepsState.userOp.callData === ''
    )
      return []

    return calls.map((call, i) => (
      <TransactionSummary
        key={call.data + randomBytes(6)}
        style={i !== calls.length! - 1 ? spacings.mbSm : {}}
        call={call}
        networkId={state?.network!.id}
        rightIcon={
          <OpenIcon
            width={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
            height={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 20 : 14}
          />
        }
        onRightIconPress={state?.handleOpenExplorer}
        size={IS_MOBILE_UP_BENZIN_BREAKPOINT ? 'lg' : 'sm'}
      />
    ))
  }, [state])

  if (state && !state?.isInitialized)
    return (
      <View style={[spacings.pv, spacings.ph, flexbox.center, flexbox.flex1]}>
        <Spinner />
      </View>
    )

  if (!state || !state.network)
    return (
      <View style={[spacings.pv, spacings.ph, flexbox.center, flexbox.flex1]}>
        <Text fontSize={24} style={spacings.mbMi} weight="semiBold">
          Error loading transaction
        </Text>
        <Text fontSize={16}>
          Invalid url params. Make sure{' '}
          <Text fontSize={16} weight="medium">
            chainId and txnId/userOpHash
          </Text>{' '}
          are provided.
        </Text>
      </View>
    )

  const {
    activeStep,
    network,
    txnId,
    userOpHash,
    stepsState,
    isRenderedInternally,
    handleCopyText,
    handleOpenExplorer,
    showCopyBtn,
    showOpenExplorerBtn
  } = state

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={maxWidthSize('xl') ? meshGradientLarge : meshGradient}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Header activeStep={activeStep} network={network} stepsState={stepsState} />
          <Steps
            activeStep={activeStep}
            network={network}
            txnId={txnId}
            userOpHash={userOpHash}
            stepsState={stepsState}
            summary={summary}
          />
          {!isRenderedInternally && (
            <Buttons
              handleCopyText={handleCopyText}
              handleOpenExplorer={handleOpenExplorer}
              showCopyBtn={showCopyBtn}
              showOpenExplorerBtn={showOpenExplorerBtn}
            />
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

export default Benzin
