import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, FlatList } from 'react-native'
import React, { useState } from 'react'
import { signOutUser } from '@/services/firebase-service'
import { router } from 'expo-router'
import { useEventStore } from '@/store/event';
import { images, icons } from '@/constants';
import { formatDate, formatEventDate } from '@/utils/util';
import SeeAll from '@/components/SeeAll';
import CardPop from '@/components/CardPop';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("BIO");
  const { events, setEvents } = useEventStore();

  const user = {
    name: "Joyce Sheila",
    following: 350,
    followers: 346,
    bio: "Traveling to new places and connecting with people from different backgrounds broadens my perspective and enriches my life. I enjoy immersing myself",
    events: [
      {
        id: 1,
        title: "Ticket to Wonderland",
        dateStart: "2024-10-22T00:00:00",
        street: "123 Wonder Ave",
        city: "Wonderland City",
        description: "I had such a fun time here. Would definitely join again.",
        coverImage: images.dog,
        price: true,
      },
      {
        id: 2,
        title: "Democracy Rules",
        dateStart: "2024-10-22T00:00:00",
        street: "456 Democracy St",
        city: "Liberty City",
        description: "I had such a fun time here. Would definitely join again.",
        coverImage: images.dog,
        price: false,
      }
    ]
  };

  const renderHistoryTab = () => {  
    return (
      <FlatList
        data={events.slice(0, 2)}
        keyExtractor={(item) => item.id.toString()}
        className='bg-white px-6 pt-4' 
        renderItem={({ item }) => {
          const formattedDate = formatEventDate(item.dateStart, true); 
  
          return (
            <TouchableOpacity>
              <View 
                className="flex-row rounded-2xl mb-4 bg-white shadow-md shadow-slate-300">
                <Image 
                  source={images.man2} 
                  className='w-[85px] h-[85px] rounded-xl m-3'
                />
                <View className='flex-1 py-3 justify-between pr-2'>
                  <View className='gap-1'>
                    <Text className='font-semibold text-primary-pBlue'>
                      {item.title}
                    </Text>
                    <Text className='text-sm text-gray-600 text-ellipsis line-clamp-2'>
                      {item.description}
                    </Text>
                  </View>
                  
                  <Text className='text-secondary-sBlue text-[12px]'>
                    {formattedDate}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const renderFavoriteTab = () => (
    <View className='bg-white px-6 gap-4 mt-4'>
      <View>
        <SeeAll
          title='My Events'
          onSeeAllPress={() => router.push('/event-list')}
          styling='ml-1' 
        />

        {events.slice(0, 2).map((event) => (
          <View 
            key={event.id} 
            className='bg-white rounded-2xl w-full items-center my-2'>
            <CardPop 
              event={event}
              onClick={() => {}}
              styling='shadow-md shadow-slate-300 w-[90%] px-4'
              imageSize='w-[80px] h-[80px] -ml-0.5'
            />
          </View>
        ))}
      </View>

      <View>
        <SeeAll
          title='Bookmark'
          onSeeAllPress={() => router.push('/event-list')}
          styling='ml-1' 
        />

        {events.slice(0, 2).map((event) => (
          <View 
            key={event.id} 
            className='bg-white rounded-2xl w-full items-center my-2'>
            <CardPop 
              event={event}
              onClick={() => {}}
              styling='shadow-md shadow-slate-300 w-[90%] px-4'
              imageSize='w-[80px] h-[80px]'
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderBioTab = () => (
    <View style={styles.bioTabContainer}>
      <Text style={styles.bioTitle}>About Me</Text>
      <Text style={styles.bioText}>
        {user.bio}
        <Text style={styles.readMoreText}> Read More...</Text>
      </Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "HISTORY":
        return renderHistoryTab();
      case "FAVORITE":
        return renderFavoriteTab();
      case "BIO":
        return renderBioTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={["1"]}
        keyExtractor={(item) => item}
        renderItem={() => renderTabContent()}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <TouchableOpacity style={styles.ticketButton}>
                <Image source={images.admitOne} style={styles.ticketIcon} />
                <Text style={styles.ticketText}>My Ticket</Text>
              </TouchableOpacity>
            </View>

            <View 
              className=''
            style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image source={images.woman3} style={styles.profileImage} />
                <View style={styles.statusDot} />
              </View>
              <Text style={styles.profileName}>{user.name}</Text>

              <View style={styles.followInfo}>
                <View style={styles.following}>
                  <Text style={styles.followingCount}>{user.following}</Text>
                  <Text style={styles.followingText}>Following</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.followers}>
                  <Text style={styles.followersCount}>{user.followers}</Text>
                  <Text style={styles.followersText}>Followers</Text>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.newButton}>
                  <Text style={styles.newButtonText}>+ New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}>
                  <Image source={icons.heart} style={styles.accountIcon} />
                  <Image source={icons.calendar} style={styles.settingsIcon} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              {["HISTORY", "FAVORITE", "BIO"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                >
                  <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }  
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  ticketButton: {
    backgroundColor: '#ebf4fa',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketIcon: {
    width: 24,
    height: 24,
  },
  ticketText: {
    color: '#4b8dd3',
    marginLeft: 6,
    fontSize:12
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    backgroundColor: '#4c9aff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  followInfo: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  following: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  followingCount: {
    fontSize: 18,
    fontWeight: '600',
  },
  followingText: {
    fontSize: 12,
    color: '#7f7f7f',
  },
  separator: {
    width: 1,
    height: 32,
    backgroundColor: '#d1d1d1',
  },
  followers: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  followersCount: {
    fontSize: 18,
    fontWeight: '600',
  },
  followersText: {
    fontSize: 12,
    color: '#7f7f7f',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  newButton: {
    backgroundColor: '#4c9aff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  editButton: {
    borderColor: '#4c9aff',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 20,
    height: 20,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  editButtonText: {
    color: '#4c9aff',
    fontWeight: '500',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4c9aff',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  activeTabText: {
    color: '#4c9aff',
    fontWeight: '600',
  },
  historyTabContainer: {
    padding: 24,
    backgroundColor: 'white',
  },
  historyEventContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  historyEventImage: {
    width: 85,
    height: 85,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 16,
    marginLeft: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  historyEventContent: {
    flex: 1,
    paddingVertical: 10,
  },
  historyEventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f4d76',
    marginBottom: 4,
  },
  historyEventDescription: {
    fontSize: 12,
    color: '#4b8dd3',
    marginBottom: 12,
  },
  historyEventDate: {
    fontSize: 12,
    color: '#888',
  },
  tabContent: {
    padding: 24,
    backgroundColor: 'white',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f4d76',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#4c9aff',
  },
  cardPop: {
    marginBottom: 16,
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardPopImage: {
    width: 85,
    height: 85,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 16,
  },
  cardPopContent: {
    flex: 1,
    paddingVertical: 10,
  },
  cardPopDate: {
    fontSize: 12,
    color: '#4b8dd3',
    marginBottom: 4,
  },
  cardPopTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f4d76',
    marginBottom: 8,
  },
  cardPopAddress: {
    fontSize: 12,
    color: '#4b8dd3',
  },
  cardPopBookmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardPopBookmarkIcon: {
    width: 24,
    height: 24,
  },
  cardPopPrice: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#ffcb00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardPopPriceText: {
    fontSize: 12,
    color: 'white',
  },
  bioTabContainer: {
    padding: 16,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#555',
  },
  readMoreText: {
    color: '#4c9aff',
    fontWeight: '500',
  },
});

export default Profile;