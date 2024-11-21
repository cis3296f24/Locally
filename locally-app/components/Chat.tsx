import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessagesByConversationId } from '@/services/firebase-service';
import { Message } from '@/types/type';
import { images } from '@/constants';

interface ChatProps {
  isVisible: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDate: string;
  curretUserId?: string;
  conversationId?: string;
}

const Chat: React.FC<ChatProps> = ({
  isVisible,
  onClose,
  eventTitle,
  eventDate,
  curretUserId,
  conversationId
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setMessages([]);
      } else {
        const texts = await fetchMessagesByConversationId(conversationId);
        setMessages(texts as Message[]);
      }
    }

    fetchMessages();
  }, []);
  

  const sendMessage = () => {
    // if (inputText.trim()) {
    //   const newMessage: Message = {
    //     id: Date.now().toString(),
    //     text: inputText,
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //     sender: 'user'
    //   };

    //   setMessages([...messages, newMessage]);
    //   setInputText('');

    //   setTimeout(() => {
    //     scrollViewRef.current?.scrollToEnd({ animated: true });
    //   }, 100);
    // }
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
            <View className="flex-row items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={onClose} className="p-2">
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              <View className="ml-3 flex-1">
                <Text className="text-[#ff6720] text-sm">{eventDate}</Text>
                <Text className="text-base font-semibold">{eventTitle}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={24} color="#083664" />
              </TouchableOpacity>
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
                    <Image
                      source={message.sender.profileImage ? { uri: message.sender.profileImage } : images.noProfileImage}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        marginRight: 8,
                      }}
                    />
                  )}
                  <View
                    style={{
                      backgroundColor: message.senderId === curretUserId ? '#d2ecf5' : '#fff1bf',
                      padding: 12,
                      borderRadius: 20,
                      maxWidth: '70%',
                    }}
                  >
                    <Text style={{
                      color: message.senderId !== curretUserId ? 'black' : 'black',
                      fontSize: 15,
                    }}>
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

            {/* Input Area */}
            <View className="flex-row p-3 bg-white border-t border-gray-200 items-center">

              <TouchableOpacity style={{ marginHorizontal: 8 }}>
                <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
              </TouchableOpacity>

              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type Message"
                style={{
                  flex: 1,
                  backgroundColor: '#F8F8F8',
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  marginHorizontal: 8,
                  fontSize: 15,
                }}
                onSubmitEditing={sendMessage}
              />

              <TouchableOpacity style={{ marginHorizontal: 8 }}>
                <Ionicons name="mic-outline" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default Chat;