import { View, Keyboard, TouchableWithoutFeedback, ScrollView, Pressable } from 'react-native'
import React from 'react'
import Map from '../../components/Map'
import SearchBar from '../../components/SearchBar'
import CategoryCard from '../../components/CategoryCard'

const Nana = () => {
  return (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss() } accessible={false}>
    <View className="flex-1 flexDirection-column bg-transparent">
        <Map></Map>
        
        <View className="absolute top-10 left-5 right-5 z-10 items-center">
          <SearchBar></SearchBar>
     
        </View>


        <View style={{position: 'absolute', marginTop: 92, marginLeft: 0}}>
            <ScrollView
              horizontal  // Enables horizontal scrolling
              showsHorizontalScrollIndicator={false}  // Hides the scroll bar (optional)
              keyboardShouldPersistTaps="handled"
              >
            <Pressable className='flex-row'>
              <View style={{ paddingLeft: 30 }}>
                <CategoryCard label="Social" iconName='account-group'></CategoryCard>

              </View>
              <CategoryCard label="Music" iconName='music'></CategoryCard>
              <CategoryCard label="Dining" iconName='food-fork-drink'></CategoryCard>
              <CategoryCard label="Exhibtion" iconName='palette'></CategoryCard>
            </Pressable>
          </ScrollView>

        </View>
   
    </View>
    </TouchableWithoutFeedback>
  )
}

export default Nana