import { Dispatch, FunctionComponent, SetStateAction, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Text, { Props as TextAppearance } from '@common/components/Text'
import useTheme from '@common/hooks/useTheme'
import spacings, { IS_SCREEN_SIZE_DESKTOP_LARGE } from '@common/styles/spacings'
import { ThemeProps } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'

import { ItemTypeContext, SMALL_MARGIN, TYPE_TO_TEXT_TYPE_MAP } from '../utils'

const TYPE_TO_ICON_MAP = {
  info: 'primary',
  error: 'errorDecorative',
  warning: 'warningDecorative'
}

const SideContentHeader = ({
  title,
  Icon = InfoIcon,
  isExpanded,
  setIsExpanded
}: {
  title: string
  Icon: FunctionComponent<any> | undefined
  isExpanded: boolean
  setIsExpanded: Dispatch<SetStateAction<boolean>>
}) => {
  const type = useContext(ItemTypeContext)
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Pressable
      onPress={() => setIsExpanded((prev: boolean) => !prev)}
      style={[
        flexbox.directionRow,
        flexbox.alignCenter,
        flexbox.justifySpaceBetween,
        isExpanded ? SMALL_MARGIN : {}
      ]}
    >
      <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.flex1]}>
        <Icon
          width={20}
          height={20}
          color={theme[TYPE_TO_ICON_MAP[type] as keyof ThemeProps]}
          style={spacings.mrTy}
          // If style has no effect, check if ...rest is passed to the icon
        />
        <Text
          appearance={TYPE_TO_TEXT_TYPE_MAP[type] as TextAppearance['appearance']}
          fontSize={IS_SCREEN_SIZE_DESKTOP_LARGE ? 18 : 16}
          weight="medium"
          numberOfLines={1}
          style={spacings.mr}
        >
          {t(title)}
        </Text>
      </View>
      {isExpanded ? (
        <UpArrowIcon color={theme[TYPE_TO_TEXT_TYPE_MAP[type] as keyof ThemeProps]} />
      ) : (
        <DownArrowIcon color={theme[TYPE_TO_TEXT_TYPE_MAP[type] as keyof ThemeProps]} />
      )}
    </Pressable>
  )
}

export default SideContentHeader
