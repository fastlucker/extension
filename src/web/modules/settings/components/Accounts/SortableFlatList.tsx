import React from 'react'
import { Platform, ScrollView, View } from 'react-native'

import flexbox from '@common/styles/utils/flexbox'
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import SortableItem from './SortableItem'

type SortableFlatListProps<T> = {
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
  style?: any
  contentContainerStyle?: any
}

function SortableFlatList<T>({
  data,
  keyExtractor,
  renderItem,
  onDragEnd,
  style,
  contentContainerStyle
}: SortableFlatListProps<T>) {
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
          style={[{ flex: 1 }, style]}
          contentContainerStyle={[flexbox.flex1, contentContainerStyle]}
          scrollEnabled
        >
          {data.map((item, index) => (
            <SortableItem key={keyExtractor(item)} id={keyExtractor(item)}>
              {(isDragging, listeners, attributes) =>
                renderItem(item, index, isDragging, listeners, attributes)
              }
            </SortableItem>
          ))}
        </ScrollView>
      </SortableContext>
    </DndContext>
  )
}

export default SortableFlatList
