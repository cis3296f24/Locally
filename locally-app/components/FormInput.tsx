import { View, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FormInputProps {
    icon?: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    secureTextEntry?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    iconPosition?: 'left' | 'right';
    editable?: boolean;
}

const FormInput = ({ 
    icon, 
    placeholder, 
    secureTextEntry = false,
    value,
    onChangeText,
    iconPosition = 'left',
    editable = true,
}: FormInputProps) => {
    const IconComponent = icon ? (
        <View style={iconPosition === 'right' ? styles.iconRight : styles.iconLeft}>
            <Ionicons name={icon} size={20} color="#999" />
        </View>
    ) : null;

    return (
        <View style={styles.container}>
            {iconPosition === 'left' && IconComponent}
            <TextInput 
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                pointerEvents={editable ? 'auto' : 'none'}
            />
            {iconPosition === 'right' && IconComponent}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E9F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
    },
    iconLeft: {
        marginRight: 12,
    },
    iconRight: {
        marginLeft: 'auto',
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#000000',
    },
});

export default React.memo(FormInput);