import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatModal from '@/components/Chat';
import { images } from '@/constants';
import UserProfileImage from '@/components/UserProfileImage';
import { Conversation, Message, User } from '@/types/type';
import { fetchConversations } from '@/services/firebase-service';
import { useUserStore } from '@/store/user';


const ChatScreen: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const { user } = useUserStore();

  useEffect(() => {
    const fetchUserConversations = async () => {
      const conversations = await fetchConversations(user?.id || '');
      setConversations(conversations);

      console.log('Conversations:', conversations);
    }

    fetchUserConversations();

    console.log('User:', user);
  }, []);

  // useEffect(() => {
  //   // Initialize your dummy data here
  //   setUsers([
  //     {
  //       id: '1',
  //       name: 'Alice',
  //       avatar: images.woman1,
  //       isOnline: true,
  //     },
  //     {
  //       id: '2',
  //       name: 'Bob',
  //       avatar: images.man2,
  //       isOnline: false,
  //     },
  //     {
  //       id: '3',
  //       name: "Charlie",
  //       avatar: images.woman3,
  //       isOnline: true,
  //     },
  //     {
  //       id: '4',
  //       name: "Dave",
  //       avatar: images.man1,
  //       isOnline: false,        
  //     },
  //     {
  //       id: '5',
  //       name: "Eve",
  //       avatar: images.woman4,
  //       isOnline: true,
  //     },
  //     {
  //       id: '6',
  //       name: 'George',
  //       avatar: images.dog,
  //       isOnline: false,
  //     }
  //   ]);

  //   setConversations([
  //     {
  //       id: '1',
  //       name: 'Charlie',
  //       avatar: images.woman3,
  //       lastMessage: 'Hey, how are you?',
  //       timestamp: '10:30 AM',
  //       isRead: true,
  //     },
  //     {
  //       id: '2',
  //       name: 'Dave',
  //       avatar: images.man1,
  //       lastMessage: "Let's catch up later.",
  //       timestamp: 'Yesterday',
  //       isRead: false,
  //     },
  //     {
  //       id: '3',
  //       name: 'Eve',
  //       avatar: images.woman4,
  //       lastMessage: 'Did you see the concert at the park?',
  //       timestamp: '2 days ago',
  //       isRead: true,
  //     },
  //   ]);
  // }, []);

  // Function to handle user press
  const handleUserPress = (user: User): void => {
    console.log('User pressed:', user.fullName);
  };

  const handleConversationPress = (conversation: Conversation): void => {
    setSelectedConversation(conversation);
    setIsChatVisible(true);
  };

  const closeChat = (): void => {
    setIsChatVisible(false);
    setSelectedConversation(null);
  };

  return (
    <SafeAreaView className='h-full w-full'>
      <View className="justify-between items-center flex-row mb-6 pl-8 pr-6 py-4">
        <View>
          <Text className="text-md text-gray-400">
            Let's Connect,
          </Text>
          <Text className="text-2xl font-semibold text-primary-pBlue">
            Alexis
          </Text>
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <TouchableOpacity className="mr-3">
            <Ionicons name="search-outline" size={30} color="#003566" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="person-add-outline" size={30} color="#003566" />
          </TouchableOpacity>
        </View>
      </View>   

      {/* Users List */}
      <View className="h-32">
        <FlatList
          data={conversations}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4"
          renderItem={({ item }) => (
            <UserProfileImage
              image={item.recipient?.profileImage}
              name={item.recipient?.fullName}
              isOnline={true}
              onPress={() => handleUserPress(item.recipient as User)}
              textStyle='text-sm mt-2 font-semibold' 
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        className="flex-1 px-6"
        renderItem={({ item, index }) => (
          <>
            <View className="h-[1px] bg-gray-200" />
            <ConversationItem
              conversation={item}
              onPress={() => handleConversationPress(item)}
            />
          </>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          isVisible={isChatVisible}
          onClose={closeChat}
          eventTitle={selectedConversation.recipient?.fullName || ''}
          eventDate="Today"
        />
      )}
    </SafeAreaView>
  );
};

export default ChatScreen;

const ConversationItem = ({ 
  conversation, 
  onPress 
} : {
  conversation: Conversation;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center py-3"
    >
      <UserProfileImage
        image={conversation.recipient?.profileImage}
        imageStyle="w-16 h-16"
        buttonStyle='mr-0'
        onPress={() => {}}
      />
      <View className="flex-1 ml-3">
        <Text className="font-semibold text-base">{conversation.name}</Text>
        <Text className="text-gray-500">{conversation.lastMessage}</Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-500 text-sm">{conversation.timestamp}</Text>
        {conversation.isRead && (
          <Ionicons name="checkmark-done" size={16} color="#2196F3" />
        )}
      </View>
    </TouchableOpacity>
  );
}