import React from 'react'
import {
  FlatList,
  FlatListProps,
  ScrollView,
  ScrollViewProps,
  SectionList,
  SectionListProps
} from 'react-native'

import styles from './styles'

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum WRAPPER_TYPES {
  SCROLL_VIEW = 'scrollview',
  FLAT_LIST = 'flatlist',
  SECTION_LIST = 'sectionlist'
}

// @ts-ignore ignored because SectionList and FlatList receive props with same names
interface Props
  extends ScrollViewProps,
    Partial<FlatListProps<any>>,
    Partial<SectionListProps<any, any>> {
  type?: WRAPPER_TYPES
}

const Wrapper = ({
  style = {},
  contentContainerStyle = {},
  children,
  type = WRAPPER_TYPES.SCROLL_VIEW,
  keyboardShouldPersistTaps,
  keyboardDismissMode,
  ...rest
}: Props) => {
  if (type === WRAPPER_TYPES.FLAT_LIST) {
    return (
      // @ts-ignore
      <FlatList
        style={[styles.wrapper, style]}
        contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps || 'handled'}
        keyboardDismissMode={keyboardDismissMode || 'none'}
        alwaysBounceVertical={false}
        {...rest}
      />
    )
  }

  if (type === WRAPPER_TYPES.SECTION_LIST) {
    return (
      // @ts-ignore
      <SectionList
        style={[styles.wrapper, style]}
        contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps || 'handled'}
        keyboardDismissMode={keyboardDismissMode || 'none'}
        alwaysBounceVertical={false}
        {...rest}
      />
    )
  }

  return (
    <ScrollView
      style={[styles.wrapper, style]}
      contentContainerStyle={[styles.contentContainerStyle, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps || 'handled'}
      keyboardDismissMode={keyboardDismissMode || 'none'}
      alwaysBounceVertical={false}
    >
      {children}
    </ScrollView>
  )
}

export default Wrapper
