import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ChatModal from '@/components/Chat';
import { images } from '@/constants';
import UserProfileImage from '@/components/UserProfileImage';
import { Conversation, Message, User } from '@/types/type';
import { fetchAllUsers, listenToConversations } from '@/services/firebase-service';
import { useUserStore } from '@/store/user';
import { formatFirestoreTimestamp } from '@/utils/util';


const ChatScreen: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user } = useUserStore();

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = listenToConversations(user.id, (updatedConversations) => {
      setConversations(updatedConversations); 
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, conversations]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await fetchAllUsers();
      setAllUsers(users);
    };

    fetchUsers();
  }, [conversations]);

  // Function to handle user press
  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setIsChatVisible(true);
  };

  const handleConversationPress = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsChatVisible(true);
  };

  const closeChat = () => {
    setIsChatVisible(false);
    setSelectedConversation(null);
    setSelectedUser(null);
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
          data={allUsers}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-8"
          renderItem={({ item }) => (
            <UserProfileImage
              image={item.profileImage}
              name={item.fullName}
              isOnline={true}
              onPress={() => handleUserPress(item)}
              textStyle='text-sm mt-2 font-semibold' 
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        className="flex-1 px-8"
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
          curretUserId={user?.id || ''}
          conversationId={selectedConversation.id}
        />
      )}

      {selectedUser && (
        <ChatModal
          isVisible={isChatVisible}
          onClose={closeChat}
          eventTitle={selectedUser.fullName}
          curretUserId={user?.id || ''}
          image={selectedUser.profileImage}
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
      />
      <View className="flex-1 ml-3 gap-1">
        <Text className="font-semibold text-base">{conversation.recipient?.fullName}</Text>
        <Text className="text-gray-500">{conversation.lastMessage}</Text>
      </View>
      <View className="items-end gap-2">
        <Text className="text-gray-500 text-sm">
          {formatFirestoreTimestamp(conversation.lastMessageTimestamp)}
        </Text>
        {conversation.isRead && (
          <Ionicons name="checkmark-done" size={16} color="#2196F3" />
        )}
      </View>
    </TouchableOpacity>
  );
}