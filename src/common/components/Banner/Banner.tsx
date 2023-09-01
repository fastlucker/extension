import { FC } from 'react'
import { Pressable, View } from 'react-native'

import EditIcon from '@common/assets/svg/EditIcon'
import useBanners from '@common/hooks/useBanners'
import useToast from '@common/hooks/useToast'
import colors from '@common/styles/colors'
import { getUiType } from '@web/utils/uiType'

import Text from '../Text'
import styles from './styles'

interface Props {
  title: string
  id: string
  text: string
  isHideBtnShown?: boolean
  actions?: {
    label: string
    onPress: () => void
    hidesBanner?: boolean
  }[]
}

const isTab = getUiType().isTab

const Banner: FC<Props> = ({ title, text, isHideBtnShown = false, actions = [], id }) => {
  const { removeBanner } = useBanners()
  const { addToast } = useToast()

  const handleHide = () => {
    try {
      removeBanner(id)
    } catch (e: any) {
      addToast(e?.message || 'Failed to remove banner.', { error: true })
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.icon}>
          {/* icon */}
          <EditIcon width={22} height={22} />
        </View>
        <View style={styles.contentInner}>
          <Text style={styles.title} fontSize={isTab ? 15 : 13} weight="medium">
            {title}
          </Text>
          <Text fontSize={13} weight="regular">
            {text}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {actions.length > 0 &&
          actions.map(({ label, onPress, hidesBanner }) => (
            <Pressable
              style={styles.action}
              onPress={() => {
                if (onPress) {
                  onPress()
                }
                if (hidesBanner) handleHide()
              }}
            >
              <Text color={colors.violet} fontSize={14} weight="regular">
                {label}
              </Text>
            </Pressable>
          ))}
        {isHideBtnShown && (
          <Pressable onPress={handleHide} style={styles.action}>
            <Text color={colors.violet} fontSize={14} weight="regular">
              Hide
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default Banner
