import React, { Children, useState } from 'react';
import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome'
import { FontAwesome6, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';'@expo/vector-icons/AntDesign';

// code for the SearchBar. Includes the search bar icon and the 'x' button to clear text
const SearchBar = () => {
  const [searchText, setSearchText] = useState('');
  const clearInput = () => {
    setSearchText('');
  };

  return (

      <View className={`flex-1 flex-row bg-white justify-center p-2 rounded-xl text-lg relative items-center justifyContent-center justify-between mb-4`}
      style={{width: '92%',}}>

      <MaterialCommunityIcons name="magnify" size={26} color={"gray"} 
        className='pr-3 pt-1 alignItems-center justifyContent-center'
        resizeMode='contain'/>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="gray" 
          className='text-xl pr-3 alignItems-center justifyContent-center'
          style={{width: '85%',}}/>

        <TouchableOpacity onPress={clearInput} >
              <MaterialCommunityIcons name="close-circle" size={20} className='pr-2' resizeMode='contain' color={"gray"}/>
        </TouchableOpacity>
      </View>
  );
};

export default SearchBar;