import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
  senderAvatar?: any;
}

interface ChatProps {
  isVisible: boolean;
  onClose: () => void;
  eventTitle: string;
  eventDate: string;
}

const Chat: React.FC<ChatProps> = ({
  isVisible,
  onClose,
  eventTitle,
  eventDate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'Hi, I wonder about the parking situation there?',
        timestamp: '12:05 PM',
        sender: 'user'
      },
      {
        id: '2',
        text: 'There is street parking around',
        timestamp: '12:15 PM',
        sender: 'other',
        senderAvatar: require('@/assets/images/woman1.png')
      },
      {
        id: '3',
        text: 'Alright! Thank you.',
        timestamp: '12:20 PM',
        sender: 'user'
      },
      {
        id: '4',
        text: "How's it going there? Is it lit?👌",
        timestamp: '07:15 PM',
        sender: 'user'
      },
      {
        id: '5',
        text: 'A lot of people here. Pretty fun!',
        timestamp: '07:16 PM',
        sender: 'other',
        senderAvatar: require('@/assets/images/woman2.jpg')
      },
      {
        id: '6',
        text: 'Yeah. Come join us.',
        timestamp: '07:20 PM',
        sender: 'other',
        senderAvatar: require('@/assets/images/woman1.png')
      },
      {
        id: '7',
        text: 'Alright! See you there.',
        timestamp: '07:25 PM',
        sender: 'user'
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'user'
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        {/*Header*/}
        <View style={{ 
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E5E5'
        }}>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontSize: 13, color: '#ff6720' }}>{eventDate}</Text>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{eventTitle}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={24} color="#083664" />
          </TouchableOpacity>
        </View>

        {/*Chat Msg*/}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1, backgroundColor: 'white', padding: 16 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={{
                flexDirection: 'row',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16,
              }}
            >
              {message.sender === 'other' && message.senderAvatar && (
                <Image
                  source={message.senderAvatar}
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
                  backgroundColor: message.sender === 'user' ? '#d2ecf5' : '#fff1bf',
                  padding: 12,
                  borderRadius: 20,
                  maxWidth: '70%',
                }}
              >
                <Text style={{ 
                  color: message.sender === 'user' ? 'black' : 'black',
                  fontSize: 15,
                }}>
                  {message.text}
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: message.sender === 'user' ? '#666' : '#666',
                  marginTop: 4,
                }}>
                  {message.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={{
          flexDirection: 'row',
          padding: 12,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          alignItems: 'center',
        }}>
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
    </Modal>
  );
};

export default Chat;