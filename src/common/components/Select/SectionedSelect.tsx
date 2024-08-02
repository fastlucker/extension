/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { SectionList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { MENU_OPTION_HEIGHT } from './styles'
import { SectionedSelectProps } from './types'
import useSelectInternal from './useSelectInternal'

const SectionedSelect = ({
  setValue,
  value,
  sections,
  menuOptionHeight = MENU_OPTION_HEIGHT,
  renderSectionHeader,
  SectionSeparatorComponent,
  stickySectionHeadersEnabled,
  testID,
  ...props
}: SectionedSelectProps) => {
  const selectData = useSelectInternal({ menuOptionHeight, setValue, value })
  const { renderItem, keyExtractor, search } = selectData

  const filteredSections = useMemo(() => {
    if (!search) return sections

    const sectionsWithFilteredData = sections.map((section) => {
      const filteredData = section.data.filter((o) => {
        let found: boolean = o.value.toString().toLowerCase().includes(search.toLowerCase())
        if (!found && typeof o.label === 'string') {
          found = o.label.toLowerCase().includes(search.toLowerCase())
        }

        return found
      })

      return {
        ...section,
        data: filteredData
      }
    })

    if (sectionsWithFilteredData.every((section) => section.data.length === 0)) {
      return []
    }

    return sectionsWithFilteredData
  }, [sections, search])

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props} testID={testID}>
      <SectionList
        sections={filteredSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={20}
        SectionSeparatorComponent={SectionSeparatorComponent}
        removeClippedSubviews
        ListEmptyComponent={<EmptyListPlaceholder />}
        stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      />
    </SelectContainer>
  )
}

export default React.memo(SectionedSelect)
