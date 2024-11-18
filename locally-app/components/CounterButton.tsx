import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CounterButton = ({
    setQuantity,
    setPrice,
    unitPrice
}: {
    setQuantity: (newQuantity: number) => void;
    setPrice: (newPrice: number) => void;
    unitPrice: number;
}) => {
    const [count, setCount] = useState(1);

    const handleIncrement = () => {
        setCount((val) => {
            const newCount = val + 1;
            setQuantity(newCount);
            setPrice(newCount * unitPrice);
            return newCount;
        });
    };

    const handleDecrement = () => {
        setCount((val) => {
        if (val > 1) { // Prevent going below 1
            const newCount = val - 1;
            setQuantity(newCount);
            setPrice(newCount * unitPrice);
            return newCount;
        }
        return val;
        });
    };

    return(
        <View className='flex-row w-200 bg-gray-300 justify-between gap-3 rounded-full p-2 items-center'>
            <TouchableWithoutFeedback onPress={handleDecrement}>
                <MaterialCommunityIcons name="minus" size={20} color="black" className='pl-1'/>            
            </TouchableWithoutFeedback>

            <Text className='text-xl'>
                {String(count)}
            </Text>

            <TouchableWithoutFeedback onPress={handleIncrement}>
                <MaterialCommunityIcons name="plus" size={20} color="black" className='pr-1'/>        
            </TouchableWithoutFeedback>
        </View>
    )
}

export default CounterButton;