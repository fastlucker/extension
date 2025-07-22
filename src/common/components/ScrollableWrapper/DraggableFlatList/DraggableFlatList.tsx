import React, { forwardRef } from 'react'
import { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import DraggableItem from './DraggableItem'

type DraggableFlatListProps<T> = {
  data: T[]
  keyExtractor: (item: T) => string
  renderItem: (
    item: T,
    index: number,
    isDragging: boolean,
    listeners: any,
    attributes: any
  ) => React.ReactNode
  onDragEnd: (fromIndex: number, toIndex: number) => void

  scrollableWrapperStyles?: ViewStyle
  contentContainerStyle?: StyleProp<ViewStyle>

  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps']
  keyboardDismissMode?: ScrollViewProps['keyboardDismissMode']
} & Omit<ScrollViewProps, 'children'>

const DraggableFlatList = forwardRef<ScrollView, DraggableFlatListProps<any>>(
  (
    {
      data,
      keyExtractor,
      renderItem,
      onDragEnd,
      scrollableWrapperStyles,
      contentContainerStyle,
      keyboardShouldPersistTaps = 'handled',
      keyboardDismissMode = 'none',
      ...rest
    },
    ref
  ) => {
    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragEnd = (event: any) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = data.findIndex((item) => keyExtractor(item) === active.id)
      const newIndex = data.findIndex((item) => keyExtractor(item) === over.id)

      onDragEnd(oldIndex, newIndex)
    }

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.map(keyExtractor)} strategy={verticalListSortingStrategy}>
          <ScrollView
            ref={ref}
            style={[{ flex: 1 }, scrollableWrapperStyles]}
            contentContainerStyle={[flexbox.flex1, contentContainerStyle]}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            keyboardDismissMode={keyboardDismissMode}
            scrollEnabled
            {...rest}
          >
            {data.map((item, index) => (
              <DraggableItem key={keyExtractor(item)} id={keyExtractor(item)}>
                {(isDragging, listeners, attributes) =>
                  renderItem(item, index, isDragging, listeners, attributes)
                }
              </DraggableItem>
            ))}
          </ScrollView>
        </SortableContext>
      </DndContext>
    )
  }
)

export default React.memo(DraggableFlatList)
