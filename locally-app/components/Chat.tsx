import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessagesByConversationId, sendMessage } from '@/services/firebase-service';
import { Message } from '@/types/type';
import { images } from '@/constants';
import UserProfileImage from './UserProfileImage';

interface ChatProps {
  isVisible: boolean;
  onClose: () => void;
  eventTitle: string;
  image?: string;
  eventDate?: string;
  curretUserId?: string;
  recipientId?: string;
  conversationId?: string;
}

const Chat: React.FC<ChatProps> = ({
  isVisible,
  onClose,
  eventTitle,
  image,
  eventDate,
  curretUserId,
  recipientId,
  conversationId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!conversationId) return;
    
    let unsubscribe = fetchMessagesByConversationId(conversationId, (messages) => {
      setMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, [conversationId]); 

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    // Clean up the listeners
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSendMessage = () => {
    if (inputText && curretUserId && recipientId && conversationId) {
      sendMessage(curretUserId, recipientId, conversationId, inputText);
      setInputText('');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 bg-black/50">
        <View className="bg-white h-[85%] mt-auto rounded-t-3xl">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
          
            {/*Header*/}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <View className='flex-row items-center'>
                <UserProfileImage
                  image={image}
                  imageStyle="w-12 h-12"
                  buttonStyle='mr-0'
                />
                <View className="ml-3">
                  { eventDate && <Text className="text-[#ff6720] text-sm">{eventDate}</Text> }
                  <Text className="text-base font-semibold">{eventTitle}</Text>
                </View>
              </View>

              <View>
                <TouchableOpacity onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/*Chat Msg*/}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 bg-white p-4"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: message.senderId === curretUserId ? 'flex-end' : 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  {message.senderId !== curretUserId && message.sender && (
                    <UserProfileImage
                      image={image}
                      imageStyle="w-8 h-8 mr-2"
                      buttonStyle='mr-0'
                    />
                  )}
                  <View 
                    className={`px-4 py-3 rounded-3xl max-w-[70%] ${message.senderId === curretUserId 
                      ? 'bg-[#d2ecf5] rounded-br-none' 
                      : 'bg-[#fff1bf] rounded-tl-none'}`}
                  >
                    <Text className='text-md'>
                      {message.text}
                    </Text>
                    <Text style={{
                      fontSize: 11,
                      color: message.senderId !== curretUserId ? '#666' : '#666',
                      marginTop: 4,
                    }}>
                      {"Today"}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            </KeyboardAvoidingView>
          
            {/* Input Area */}
            <View className={`mb-4 ${isKeyboardVisible ? "flex-1" : ""}`}>
              <View className="flex-row p-3 bg-white border-t border-gray-200 items-center">

                <TouchableOpacity style={{ marginHorizontal: 8 }}>
                  <Ionicons name="add-circle-outline" size={27} color="#2196F3" />
                </TouchableOpacity>

                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Type Message"
                  className='flex-1 bg-[#F8F8F8] rounded-3xl px-6 py-4 text-primary-pBlue'
                />

                <TouchableOpacity
                  className='p-2'
                  onPress={handleSendMessage}
                >
                  <Ionicons name="paper-plane-outline" size={27} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default Chat;