/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { SectionList } from 'react-native'

import Text from '@common/components/Text'

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
  ...props
}: SectionedSelectProps) => {
  const selectData = useSelectInternal({ menuOptionHeight, setValue, value })
  const { renderItem, keyExtractor, search } = selectData

  const filteredSections = useMemo(() => {
    if (!search) return sections

    return sections.map((section) => {
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
  }, [sections, search])

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props}>
      <SectionList
        sections={filteredSections}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>} // @TODO
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={20}
        removeClippedSubviews
        ListEmptyComponent={<EmptyListPlaceholder />}
      />
    </SelectContainer>
  )
}

export default React.memo(SectionedSelect)
