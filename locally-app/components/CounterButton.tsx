import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CounterButton = () => {
    const [count, setCount] = useState(1);

    const handleIncrement = () => {
        setCount((val) => val + 1)
    }

    const handleDecrement = () => {
        setCount((val) => val - 1)
    }

    return(
        <View className='flex-row h-6 w-100 bg-gray-300 justify-between gap-3 rounded-full pb-2 items-center'>
            <TouchableWithoutFeedback onPress={handleDecrement}>
                <MaterialCommunityIcons name="minus" size={15} color="black" className='pl-1'/>            
            </TouchableWithoutFeedback>

            <Text>{String(count)}</Text>

            <TouchableWithoutFeedback onPress={handleIncrement}>
                <MaterialCommunityIcons name="plus" size={15} color="black" className='pr-1'/>        
            </TouchableWithoutFeedback>
        </View>
    )
}

export default CounterButton;