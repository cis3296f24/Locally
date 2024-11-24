import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Modal, Keyboard, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchConversationIdByUserIds, fetchEventBasedMessages, fetchMessagesByConversationId, fetchUserProfile, sendMessage, sendMessageToEvent } from '@/services/firebase-service';
import { Message } from '@/types/type';
import UserProfileImage from './UserProfileImage';
import { formatFirestoreTimestamp } from '@/utils/util';
import { useUserStore } from '@/store/user';
import { router } from 'expo-router';

interface ChatProps {
  title: string;
  image?: string;
  date?: string;
  curretUserId: string ;
  recipientId?: string;
  conversationId?: string;
  eventId?: string;
  isVisible: boolean;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({
  title,
  image,
  date,
  curretUserId,
  recipientId,
  conversationId,
  eventId,
  isVisible,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState(conversationId ? conversationId : 'none');
  const [isNewConversation, setIsNewConversation] = useState(conversationId ? false : true);

  useEffect(() => {
    if (!conversation) return;
    
    let unsubscribe = fetchMessagesByConversationId(conversation, (messages) => {
      setMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, [conversation]); 

  useEffect(() => {
    if (!eventId) return;
    
    let unsubscribe = fetchEventBasedMessages(eventId, (messages) => {
      setMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, [eventId]);

  useEffect(() => {
    const fetchConversationByUser = async () => {
      if (recipientId) {
        const conversationId = await fetchConversationIdByUserIds(curretUserId, recipientId);
        setConversation(conversationId);
      }
    }
    fetchConversationByUser();
  }, []);

  const handleSendMessage = async () => {
    if (inputText && curretUserId && recipientId) {
      const newId = await sendMessage(curretUserId, recipientId, conversation, inputText);
      setInputText('');

      if (isNewConversation) {
        setConversation(newId);
        setIsNewConversation(false);
      }
    }

    if (eventId && inputText && curretUserId) {
      sendMessageToEvent(curretUserId, eventId, inputText);
      setInputText('');
    }

    console.log('Send Message');
    console.log('inputText', inputText);
    console.log('curretUserId', curretUserId);
    console.log('recipientId', recipientId);
    console.log('eventId', eventId);
    console.log('conversationId', conversation);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View className="flex-1 bg-black/50">
        <View className="bg-white h-[85%] mt-auto rounded-t-3xl">
            {/*Header*/}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <View className='flex-row items-center'>
                <UserProfileImage
                  image={image}
                  imageStyle="w-12 h-12"
                  buttonStyle='mr-0'
                />
                <View className="ml-3">
                  { date && <Text className="text-[#ff6720] text-sm">{date}</Text> }
                  <Text className="text-base font-semibold">
                    {title}
                  </Text>
                </View>
              </View>

              <View>
                <TouchableOpacity onPress={onClose} className="p-2">
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={130} 
          >
            <MessageList 
              messages={messages} 
              currentUserId={curretUserId}
              onClickUserImage={onClose} 
            />
         
            {/* Input Area */}
            <View>
              <View className="flex-row p-3 mb-4 bg-white border-t border-gray-200 items-center">

                <TouchableOpacity 
                  style={{ marginHorizontal: 8 }}
                >
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
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default Chat;

const MessageList = ({ 
  messages, 
  currentUserId,
  onClickUserImage, 
} : {
  messages: Message[];
  currentUserId: string;
  onClickUserImage?: () => void;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const { setSelectedUser } = useUserStore();

  const handleUserImagePress = async (userId: string) => {
    const user = await fetchUserProfile(userId);
    setSelectedUser(user);
    onClickUserImage && onClickUserImage();
    console.log("User", user);
    router.push('/(root)/user-profile');
  }

  const renderItem = ({ item: message }: { item: Message }) => (
    <View
      className={`flex-row ${message.senderId === currentUserId 
        ? 'justify-end' 
        : 'justify-start'} 
        mt-6 mx-2`}
    >
      {message.senderId !== currentUserId && message.sender && (
        <UserProfileImage 
          image={message.sender.profileImage} 
          imageStyle="w-8 h-8 mx-3"
          onPress={() => handleUserImagePress(message.senderId)} 
        />
      )}
      <View
        className={`px-4 py-3 rounded-3xl max-w-[70%] ${
          message.senderId === currentUserId
            ? 'bg-[#d2ecf5] rounded-br-none mr-2'
            : 'bg-[#fff1bf] rounded-tl-none'
        }`}
      >
        <Text className="text-md">
          {message.text}
        </Text>
        <Text className="text-xs text-[#666] mt-1">
          {formatFirestoreTimestamp(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={messages}
      ref={flatListRef}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      onContentSizeChange={() => {
        flatListRef?.current?.scrollToEnd({ animated: true });
      }}
    />
  );
};