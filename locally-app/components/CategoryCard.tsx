import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Button} from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const CategoryCard = ({
    label, 
    iconName,
    focusColor,
    isSelected,
    selecttedCategory,
}: {
    label: string;
    iconName: any;
    focusColor: string;
    isSelected: boolean;
    selecttedCategory: (label: string) => void;
}) => {
    const color = isSelected ? focusColor : '#003566';

    return(
        <TouchableOpacity 
            className="flex-row items-center bg-white rounded-full py-2 px-4"
            delayPressIn={50}
            onPress={() => selecttedCategory(label)}
        >
            <MaterialIcons name={iconName} size={24} color={color} className="mr-2" />
            <Text className="text-lg text-gray-800">
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default CategoryCard
