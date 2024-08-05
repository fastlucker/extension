import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, Pressable, View } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useRoute from '@common/hooks/useRoute'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

// @ts-ignore
import Story6 from './images/story-6.png'
import getStyles, { STORY_CARD_WIDTH } from './styles'
// @ts-ignore
import Video1 from './videos/1-Welcome.mp4'
// @ts-ignore
import Video2 from './videos/2-MMReplacement.mp4'
// @ts-ignore
import Video3 from './videos/3-GasTank.mp4'
// @ts-ignore
import Video4 from './videos/4-HWs.mp4'
// @ts-ignore
import Video5 from './videos/5-WALLET.mp4'

export const ONBOARDING_VERSION = '1.0.0'

const Stories = ({ onComplete }: { onComplete: () => void }) => {
  const { theme, styles } = useTheme(getStyles)
  const [currentStory, setCurrentStory] = useState(0)
  const [agreedWithTerms, setAgreedWithTerms] = useState(false)
  const { t } = useTranslation()
  const { params } = useRoute()
  const { navigate } = useNavigation()

  useEffect(() => {
    if (params?.storyIndex) {
      setCurrentStory(params.storyIndex)
    }
  }, [params?.storyIndex])

  const STORIES_DATA = useMemo(() => {
    return [
      {
        id: 'story-1',
        GIF: (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video autoPlay loop width={STORY_CARD_WIDTH} height={318} style={{ objectFit: 'fill' }}>
            <source src={Video1} type="video/mp4" />
          </video>
        ),
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('Welcome to Ambire Wallet!')}
          </Text>
        ),
        Description: (
          <Trans>
            <Text fontSize={14}>
              <Text fontSize={14}>{'The first '}</Text>
              <Text fontSize={14} weight="semiBold">
                {'hybrid self-custodial wallet '}
              </Text>
              <Text fontSize={14}>
                {
                  'to support Basic (EOAs) and Smart Accounts without compromising user experience. '
                }
              </Text>
              <Text fontSize={14} weight="semiBold">
                Powered by Account Abstraction.
              </Text>
            </Text>
          </Trans>
        )
      },
      {
        id: 'story-2',
        GIF: (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video autoPlay loop width={STORY_CARD_WIDTH} height={318} style={{ objectFit: 'fill' }}>
            <source src={Video2} type="video/mp4" />
          </video>
        ),
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('Ambire can replace Metamask everywhere!')}
          </Text>
        ),
        Description: (
          <Trans>
            <Text fontSize={14}>
              Ambire works like MetaMask, but with the added Smart Accounts, you get features like
              seedless accounts, transaction batching, transaction simulation, gas abstraction, and
              more.
            </Text>
          </Trans>
        )
      },
      {
        id: 'story-3',
        GIF: (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video autoPlay loop width={STORY_CARD_WIDTH} height={318} style={{ objectFit: 'fill' }}>
            <source src={Video3} type="video/mp4" />
          </video>
        ),
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('Pay and prepay gas in custom tokens on any chain!')}
          </Text>
        ),
        Description: (
          <Trans>
            <Text fontSize={14}>
              <Text fontSize={14}>{'With Smart Accounts and the Gas Tank feature, '}</Text>
              <Text fontSize={14} weight="semiBold">
                you can pay and prepay gas with stablecoins and custom tokens
              </Text>
              <Text fontSize={14}>
                . Top up on one network and pay on any supported one to save on gas fees.
              </Text>
            </Text>
          </Trans>
        )
      },
      {
        id: 'story-4',
        GIF: (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video autoPlay loop width={STORY_CARD_WIDTH} height={318} style={{ objectFit: 'fill' }}>
            <source src={Video4} type="video/mp4" />
          </video>
        ),
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('The wallet security you deserve!')}
          </Text>
        ),
        Description: (
          <Trans>
            <Text fontSize={14}>
              <Text fontSize={14}>{'Built on '}</Text>
              <Text fontSize={14} weight="semiBold">
                {'continuously audited '}
              </Text>
              <Text fontSize={14}>{'smart contracts by an experienced team, Ambire Wallet '}</Text>
              <Text fontSize={14} weight="semiBold">
                {'keeps your funds safe '}
              </Text>{' '}
              <Text fontSize={14}>
                with on-chain transaction simulation and hardware wallet support.
              </Text>
            </Text>
          </Trans>
        )
      },
      {
        id: 'story-5',
        GIF: (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video autoPlay loop width={STORY_CARD_WIDTH} height={318} style={{ objectFit: 'fill' }}>
            <source src={Video5} type="video/mp4" />
          </video>
        ),
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('Get rewarded for using Smart Accounts!')}
          </Text>
        ),
        Description: (
          <Trans>
            <Text fontSize={14}>
              <Text fontSize={14}>{'The development of '}</Text>
              <Text fontSize={14} weight="semiBold">
                Ambire Wallet is governed by holders of our $WALLET token
              </Text>
              <Text fontSize={14}>
                . You earn $WALLET just by securely holding funds in your Ambire account.
              </Text>
            </Text>
          </Trans>
        )
      },
      {
        id: 'story-6',
        // the gif is temporarily an image
        GIF: <Image source={Story6} style={styles.gif} />,
        Title: (
          <Text fontSize={20} weight="semiBold" style={spacings.mbSm}>
            {t('Terms of Service')}
          </Text>
        ),
        Description: (
          <View>
            <Trans>
              <Text style={spacings.mbLg}>
                <Text fontSize={14}>Ambire Wallet is an</Text>{' '}
                <Text fontSize={14} weight="semiBold">
                  open-source, non-custodial
                </Text>{' '}
                <Text fontSize={14}>cryptocurrency wallet.</Text>{' '}
                <Text
                  fontSize={14}
                  underline
                  color={theme.infoDecorative}
                  onPress={() => navigate('terms', { state: { storyIndex: 5 } })}
                >
                  Read full Terms of Service.
                </Text>
              </Text>
            </Trans>
            <Checkbox
              value={agreedWithTerms}
              onValueChange={setAgreedWithTerms}
              uncheckedBorderColor={theme.primaryText}
              label={t('I agree to the Terms of Service and Privacy Policy.')}
            />
          </View>
        )
      }
    ]
  }, [t, styles, theme, agreedWithTerms, navigate])

  const moveToPrevStory = () => {
    if (currentStory !== 0) {
      setCurrentStory((p) => p - 1)
    }
  }

  const moveToNextStory = useCallback(() => {
    if (currentStory !== STORIES_DATA.length - 1) {
      setCurrentStory((p) => p + 1)
    } else {
      !!onComplete && onComplete()
    }
  }, [currentStory, onComplete, STORIES_DATA.length])

  const handleBulletPress = (bulletIndex: number) => {
    if (bulletIndex !== currentStory) setCurrentStory(bulletIndex)
  }

  return (
    <>
      {STORIES_DATA.map(({ id, GIF, Title, Description }, i) => (
        <View style={[styles.container, i !== currentStory && { display: 'none' }]} key={id}>
          {GIF}
          <View style={styles.contentContainer}>
            <View style={flexbox.flex1}>
              {Title}
              {Description}
            </View>
            <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifySpaceBetween]}>
              <View style={[flexbox.directionRow]}>
                {STORIES_DATA.map(({ id: bulletId }, bulletIndex) => (
                  <Pressable
                    key={`bullet-${bulletId}`}
                    style={({ hovered }: any) => [
                      styles.bullet,
                      currentStory === bulletIndex && styles.activeBullet,
                      currentStory !== bulletIndex && hovered && styles.hoveredBullet
                    ]}
                    onPress={() => handleBulletPress(bulletIndex)}
                    testID={
                      currentStory === bulletIndex ? `selected-bullet-${bulletIndex}` : undefined
                    }
                  />
                ))}
              </View>
              <View style={[flexbox.directionRow, flexbox.alignCenter]}>
                {currentStory !== 0 && (
                  <Button
                    testID="stories-button-previous"
                    type="ghost"
                    size="small"
                    text={t('Previous')}
                    style={{ minWidth: 96, ...spacings.mr }}
                    onPress={moveToPrevStory}
                    childrenPosition="left"
                    hasBottomSpacing={false}
                  >
                    <LeftArrowIcon color={iconColors.primary} style={spacings.mrTy} />
                  </Button>
                )}
                <Button
                  testID="stories-button-next"
                  type="secondary"
                  size="small"
                  text={currentStory === STORIES_DATA.length - 1 ? t('Got it') : t('Next')}
                  style={{ minWidth: 96 }}
                  onPress={moveToNextStory}
                  hasBottomSpacing={false}
                  disabled={currentStory === STORIES_DATA.length - 1 && !agreedWithTerms}
                  submitOnEnter
                >
                  {currentStory !== STORIES_DATA.length - 1 && (
                    <RightArrowIcon color={theme.primary} style={spacings.mlSm} />
                  )}
                </Button>
              </View>
            </View>
          </View>
        </View>
      ))}
    </>
  )
}

export default React.memo(Stories)
