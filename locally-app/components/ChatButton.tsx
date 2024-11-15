import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{ 
        position: 'absolute',
        // bottom: 20,
        // right: 20,
        backgroundColor: '#FFC700',
        borderRadius: 30,
        paddingVertical: 14, // Top and bottom padding
        paddingHorizontal: 15, 
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name="chatbubble-ellipses" size={24} color="#003566" />
      <Text style={{ color: '#003566', marginLeft: 8, fontWeight: '600' }}>Chat</Text>
    </TouchableOpacity>
  );
};

export default ChatButton;