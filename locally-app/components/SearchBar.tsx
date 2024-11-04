import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';'@expo/vector-icons/AntDesign';

// code for the SearchBar. Includes the search bar icon and the 'x' button to clear text
const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const clearInput = () => {
    setSearchText('');
  };

  return (

    <View 
      className="flex-row bg-white w-[90%] px-4 py-3 rounded-full text-lg items-center justify-between mx-6"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <MaterialCommunityIcons name="magnify" size={30} color={"gray"} />

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="gray" 
          className='text-xl flex-1'
        />
      </View>
      
      {searchText.length > 0 && (
        <TouchableOpacity onPress={clearInput}>
          <MaterialCommunityIcons name="close-circle" size={20} color="gray" className='pl-4'/>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;