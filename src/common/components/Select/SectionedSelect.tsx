/* eslint-disable react/prop-types */
import React from 'react'
import { SectionList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { SectionedSelectProps } from './types'
import useSelectInternal from './useSelectInternal'

const SectionedSelect = ({
  setValue,
  value,
  sections,
  menuOptionHeight,
  renderSectionHeader,
  SectionSeparatorComponent,
  stickySectionHeadersEnabled,
  emptyListPlaceholderText,
  attemptToFetchMoreOptions,
  testID,
  ...props
}: SectionedSelectProps) => {
  const selectData = useSelectInternal({
    menuOptionHeight,
    setValue,
    value,
    isSectionList: true,
    data: sections
  })
  const { filteredData, renderItem, keyExtractor } = selectData

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props} testID={testID}>
      <SectionList
        sections={filteredData as SectionedSelectProps['sections']}
        renderItem={renderItem as any}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={20}
        SectionSeparatorComponent={SectionSeparatorComponent}
        removeClippedSubviews
        ListEmptyComponent={<EmptyListPlaceholder placeholderText={emptyListPlaceholderText} />}
        stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      />
    </SelectContainer>
  )
}

export default React.memo(SectionedSelect)
