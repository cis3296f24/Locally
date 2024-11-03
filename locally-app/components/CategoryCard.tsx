import { View, Text, StyleSheet} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';'@expo/vector-icons/AntDesign';

interface CategoryCardProps { // use this to define the types for the arguments
    label: string; 
    iconName: string;
}


const CategoryCard: React.FC<CategoryCardProps> = ({label, iconName}) => {

    const [width, setWidth] = useState(0); // dynamically resize shape of oval to fit the text and icon

    useEffect(() => { // Calculate the width based on the label length
        const calculatedWidth = label.length * 10 + 65; // Adjust factor for padding
        setWidth(calculatedWidth);
    }, [label]);

    return(
        <View style={[styles.oval , { width }]}>
             <MaterialCommunityIcons name={iconName} size={30} color="#39C3F2" className='pl-4 pr-2'/>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    oval: { // styling for the oval shape of the filter icons
      width: 100,          
      height: 45,         
      backgroundColor: 'white',  
      borderRadius: 25,  
      alignItems: 'center',
      marginRight: 10,
      shadowColor: '#000', 
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      flexDirection: 'row',
    },
    text: {
        color: 'grey',           
        fontSize: 18,             
    },

  });

export default CategoryCard