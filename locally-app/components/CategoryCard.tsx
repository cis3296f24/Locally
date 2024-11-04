import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Button} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';'@expo/vector-icons/AntDesign';

const CategoryCard = ({
    label, 
    iconName,
}: CategoryCardProps) => {
    return(
        <TouchableOpacity 
            className="flex-row items-center bg-white rounded-full py-2 px-4"
            delayPressIn={50}
        >
            <MaterialCommunityIcons name={iconName} size={30} color="#39C3F2" className="mr-2" />
            <Text className="text-lg text-gray-800">
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default CategoryCard

// const styles = StyleSheet.create({
//     oval: { // styling for the oval shape of the filter icons
//       width: 100,          
//       height: 45,         
//       backgroundColor: 'white',  
//       borderRadius: 25,  
//       alignItems: 'center',
//       marginRight: 10,
//       shadowColor: '#000', 
//       shadowOpacity: 0.25,
//       shadowRadius: 3.5,
//       flexDirection: 'row',
//     },
//     text: {
//         color: 'grey',           
//         fontSize: 18,             
//     },

//   });
