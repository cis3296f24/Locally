import { View, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import Map from '@/components/Map'
import SearchBar from '@/components/SearchBar'
import CategoryCard from '@/components/CategoryCard'

const Explore = () => {
  return (
    <View className="h-full w-full bg-transparent">
      <View className="z-0">
        <Map />
      </View>
      
      <View className="absolute top-[8%] left-5 right-5 z-1 items-center justify-center">
        <SearchBar />

        <ScrollView
          className='mt-6 left-5'
          horizontal  // Enables horizontal scrolling
          showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
          keyboardShouldPersistTaps="handled"
        >
          <View className='gap-4 flex-row'>
            <CategoryCard label="Social" iconName='account-group'></CategoryCard>
            <CategoryCard label="Music" iconName='music'></CategoryCard>
            <CategoryCard label="Dining" iconName='food-fork-drink'></CategoryCard>
            <CategoryCard label="Exhibtion" iconName='palette'></CategoryCard>
          </View>
        </ScrollView>

      </View>

    </View>

    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss() } accessible={false}>
      
    // </TouchableWithoutFeedback>
  )
}

export default Explore