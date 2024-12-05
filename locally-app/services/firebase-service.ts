import { Firebase_Auth, Firebase_Firestore, Firebase_Storage } from "@/configs/firebase";
import { User, Event, Ticket, Message, Conversation } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, orderBy, startAt, endAt, where, GeoPoint, limit, Timestamp, updateDoc, onSnapshot, deleteDoc, getCountFromServer, QueryDocumentSnapshot, startAfter } from "firebase/firestore";
import { useUserStore } from "@/store/user";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// Firebase Authentication

export const signUpUser = async ({
  fullName, 
  email, 
  password 
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(Firebase_Auth, email, password);
    const user = {
      id: userCredential.user.uid,
      email,
      fullName,
      username: fullName.split(' ')[0].toLowerCase().slice(0, 16),
      isSubscribed: false,
      profileImage: "",
      followingCount: 0,
      followersCount: 0
    }

    await updateUserProfile(user);
    useUserStore.getState().setUser(user);

    return { user };
  } catch (error) {
    throw new Error('Registration failed. Please try again.');
  }
};

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(Firebase_Auth, email, password);
    const user = await fetchUserProfileById(userCredential.user.uid);
    
    useUserStore.getState().setUser(user);

    return { user }; 
  } catch (error) {
    throw new Error('Invalid credentials. Please check your email or password.');
  }
};

export const signOutUser = async () => {
  try {
    await Firebase_Auth.signOut();
    useUserStore.getState().clearUser();
    return true
  } catch (error) {
    console.error("Error signing out:", error);
    return false
  }
}

// Firebase Storage

export const uploadImage = async (
  fileUri: string, 
  userId: string,
  path: string
) => {
  try {
    const { uri } = await FileSystem.getInfoAsync(fileUri)
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    console.log('Blob', blob)

    const fileName = fileUri.split('/').pop();
    const storageRef = ref(Firebase_Storage, `${path}/${userId}/${fileName}`);
    await uploadBytes(storageRef, blob as Blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error('Error uploading image. Please try again.');
  }
};

// Firebase Firestore (USER)

export const updateUserProfile = async (userData: User) => {
  try {
    const userRef = doc(Firebase_Firestore, 'users', userData.id);
    
    const newUser: User = {
      ...userData,
      username: userData.username ?? userData.fullName.split(' ')[0].toLowerCase(),
      isSubscribed: userData.isSubscribed ?? false,
      profileImage: userData.profileImage,
    };
    
    await setDoc(userRef, newUser);
  } catch (error) {
    console.error("Error creating user profile:", error);
  }
}

export const fetchUserProfileById = async (userId: string) => {
  try {
    const userRef = doc(Firebase_Firestore, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = userSnapshot.data();

    const followingRef = collection(Firebase_Firestore, `users/${userId}/following`);
    const followingCount = (await getCountFromServer(followingRef)).data().count;

    const followersRef = collection(Firebase_Firestore, `users/${userId}/followers`);
    const followersCount = (await getCountFromServer(followersRef)).data().count;
    const followersSnapshot = await getDocs(followersRef);
    const followersIds = followersSnapshot.docs.map((doc) => doc.id);

    const isFollowing = followersIds.includes(useUserStore.getState().user?.id ?? '');

    return {
      ...userData,
      followingCount,
      followersCount,
      isFollowing,
    } as unknown as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export const fetchAllUsers = async () => {
  try {
    const currentUser = Firebase_Auth.currentUser;

    if (!currentUser) {
      throw new Error("No authenticated user found.");
    }

    const usersRef = collection(Firebase_Firestore, "users");
    const usersSnapshot = await getDocs(usersRef);

    const users: User[] = usersSnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as User;
    }).filter((user) => user.id !== currentUser.uid);

    return users;
  } catch (error) {
    console.log("Error fetching users:", error);
    throw error;
  }
};

// Firebase Firestore (FOLLOWERS/FOLLOWING)

export const followUser = async (currentUserId: string, otherUserId: string) => {
  try {
    const currentUserFollowingRef = collection(Firebase_Firestore, `users/${currentUserId}/following`);
    setDoc(doc(currentUserFollowingRef, otherUserId), {});

    const otherUserFollowersRef = collection(Firebase_Firestore, `users/${otherUserId}/followers`);
    setDoc(doc(otherUserFollowersRef, currentUserId), {});

    fetchUserProfileById(currentUserId)
      .then((currentUser) => {
        useUserStore.getState().setUser(currentUser);
      })
      .catch((error) => {
        console.error("Error fetching or updating user profile:", error);
      });
    
    fetchUserProfileById(otherUserId)
      .then((otherUser) => {
        useUserStore.getState().setSelectedUser(otherUser);
      })
      .catch((error) => {
        console.error("Error fetching or updating user profile:", error);
      });

    console.log("User followed successfully!");
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

export const unfollowUser = async (currentUserId: string, otherUserId: string) => {
  try {
    const currentUserFollowingRef = doc(Firebase_Firestore, `users/${currentUserId}/following`, otherUserId);
    deleteDoc(currentUserFollowingRef);

    const otherUserFollowersRef = doc(Firebase_Firestore, `users/${otherUserId}/followers`, currentUserId);
    deleteDoc(otherUserFollowersRef);

    fetchUserProfileById(currentUserId)
      .then((currentUser) => {
        useUserStore.getState().setUser(currentUser);
      })
      .catch((error) => {
        console.error("Error fetching or updating user profile:", error);
      });

    fetchUserProfileById(otherUserId)
      .then((otherUser) => {
        useUserStore.getState().setSelectedUser(otherUser);
      })
      .catch((error) => {
        console.error("Error fetching or updating user profile:", error);
      });

    console.log("User unfollowed successfully!");
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};


// Firebase Firestore (EVENTS)

export const createEvent = async (
  eventData: Omit<Event, "id" | "coverImage" | "ownerId">,
  fileUri: string,
): Promise<Event> => {
  try {
    const userId = Firebase_Auth.currentUser?.uid;
    if (!userId) {
      throw new Error("User is not logged in.");
    }

    const coverImage = await uploadImage(fileUri, userId, 'event_images');

    const eventsCollectionRef = doc(collection(Firebase_Firestore, 'events'));
    const userEventRef = collection(Firebase_Firestore, `users/${userId}/event-owner`);

    const eventToSave: Event = {
      ...eventData,
      id: eventsCollectionRef.id,
      coordinate: new GeoPoint(eventData.coordinate.latitude, eventData.coordinate.longitude),
      coverImage: coverImage,
      ownerId: userId,
      dateCreated: Timestamp.now(),
    };

    await Promise.all([
      setDoc(eventsCollectionRef, eventToSave),
      setDoc(doc(userEventRef, eventToSave.id), {})
    ]);

    return eventToSave;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export const fetchCreatedEventsByUserId = async (userId: string) => {
  const userEventsRef = collection(Firebase_Firestore, `users/${userId}/event-owner`);
  const querySnapshot = await getDocs(userEventsRef);

  const eventIds = querySnapshot.docs.map((doc) => doc.id);

  const events = await Promise.all(
    eventIds.map(async (eventId) => {
      const eventDocRef = doc(Firebase_Firestore, `events`, eventId);
      const eventDoc = await getDoc(eventDocRef);
      return { id: eventDoc.id, ...eventDoc.data() } as Event;
    })
  );

  return events;
}

// export const fetchEventsByCityWithListener = (
//   city: string,
//   onEventsUpdated: (events: Event[]) => void
// ) => {
//   const eventsCollectionRef = collection(Firebase_Firestore, "events");
//   console.log("Fetching events for city:", city)

//   const cityQuery = query(
//     eventsCollectionRef,
//     where("city", "==", city)
//   );

//   const unsubscribe = onSnapshot(
//     cityQuery,
//     async (querySnapshot) => {
//       const eventsWithOwners = await Promise.all(
//         querySnapshot.docs
//           .filter((doc) => {
//             return doc.data().dateStart.toDate() >= new Date();
//           })
//           .map(async (doc) => {
//             const event = {
//               id: doc.id,
//               ...doc.data(),
//             } as Event;

//             return event;
//           })
//       );

//       onEventsUpdated(eventsWithOwners); // Pass the updated events to the callback
//     },
//     (error) => {
//       console.error("Error listening to events:", error);
//     }
//   );

//   return unsubscribe;
// };

export const fetchEventsByCity = async (city: string) => {
  const eventsCollectionRef = collection(Firebase_Firestore, "events");
  const currentUid = Firebase_Auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error("User is not logged in.");
  }

  const cityQuery = query(
    eventsCollectionRef, 
    where("city", "==", city)
  );
  const querySnapshot = await getDocs(cityQuery)

  const eventsWithOwners = await Promise.all(
    querySnapshot.docs
      .filter((snapshot) => {
        return snapshot.data().dateStart.toDate() >= new Date();
      })
      .map(async (snapshot) => {
        const eventId = snapshot.id;

        // Fetch participants
        const participantsCollectionRef = collection(Firebase_Firestore, `events/${eventId}/participants`);
        const participantsSnapshot = await getDocs(participantsCollectionRef);
        const attendeeIds = participantsSnapshot.docs.map((participantDoc) => participantDoc.id);

        const event = {
          id: snapshot.id,
          ...snapshot.data(),
          attendeeIds
        } as Event;

        return event;
      }
    )
  );

  return eventsWithOwners;
};

export const bookmarkEvent = async (eventId: string) => {
  const currentUid = Firebase_Auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error("User is not logged in.");
  }

  try {
    const userBookmarksRef = collection(Firebase_Firestore, `users/${currentUid}/bookmarks`);
    const eventBookmarksRef = collection(Firebase_Firestore, `events/${eventId}/bookmarks`);
    await setDoc(doc(userBookmarksRef, eventId), {});
    await setDoc(doc(eventBookmarksRef, currentUid), {});

    console.log("Event bookmarked successfully!");
  } catch (error) {
    console.error("Error bookmarking event:", error);
    throw error;
  }
}

export const unbookmarkEvent = async (eventId: string) => {
  const currentUid = Firebase_Auth.currentUser?.uid;
  if (!currentUid) {
    throw new Error("User is not logged in.");
  }

  try {
    const userBookmarksRef = doc(Firebase_Firestore, `users/${currentUid}/bookmarks`, eventId);
    const eventBookmarksRef = doc(Firebase_Firestore, `events/${eventId}/bookmarks`, currentUid);
    await deleteDoc(userBookmarksRef);
    await deleteDoc(eventBookmarksRef);

    console.log("Event unbookmarked successfully!");
  } catch (error) {
    console.error("Error unbookmarking event:", error);
    throw error;
  }
}

export const fetchBookmarkedEventsByUserId = async (userId: string) => {
  try {
    const userBookmarksRef = collection(Firebase_Firestore, `users/${userId}/bookmarks`);
    const querySnapshot = await getDocs(userBookmarksRef);
    const eventIds = querySnapshot.docs.map((doc) => doc.id);

    const events = await Promise.all(
      eventIds.map(async (eventId) => {
        const eventDocRef = doc(Firebase_Firestore, `events`, eventId);
        const eventDoc = await getDoc(eventDocRef);
        return { 
          id: eventDoc.id,
          ...eventDoc.data() 
        } as Event;
      })
    );

    return events;
  } catch (error) {
    console.error("Error fetching bookmarked events:", error);
    throw error;
  }
}


// Firebase Firestore (TICKETS)

export const createTicket = async (
  event: Event,
  user: User,
  numTickets: number,
  total: string
) => {
  try {
    const ticketRef = doc(collection(Firebase_Firestore, 'tickets'));
    const ticketId = ticketRef.id;

    const newTicket: Ticket = {
      ticketId: ticketId,
      eventName: event.title,
      eventAddress: `${event.street}, ${event.city}, ${event.state} ${event.zipCode}`,
      userName: user.fullName,
      orderNumber: `#${Math.floor(Math.random() * 100000)}`,
      date: event.dateStart,
      time: event.timeStart,
      numTickets: numTickets,
      total: total,
      eventImage: event.coverImage ?? "",
      qrcode: `Event: ${event.title}, Name: ${user.fullName}, Total: ${total}, Number of Tickets: ${numTickets}`,

      eventId: event.id,
      userId: user.id,
    };

    console.log('Ticket created with Firestore-generated ID:', ticketId);

    const eventTicketRef = doc(Firebase_Firestore, `events/${event.id}/ticket-purchase`, ticketId);
    const eventParticipantsRef = doc(Firebase_Firestore, `events/${event.id}/participants`, user.id);
    const userTicketRef = doc(Firebase_Firestore, `users/${user.id}/ticket-purchase`, ticketId);

    await Promise.all([
      setDoc(ticketRef, newTicket),
      setDoc(eventTicketRef, {}),
      setDoc(eventParticipantsRef, {}),
      setDoc(userTicketRef, {}),
    ]);

    console.log('Ticket created successfully and added to event and user subcollections!');

    const ticketDoc = await getDoc(ticketRef);

    if (ticketDoc.exists()) {
      return ticketDoc.data() as Ticket;
    } else {
      throw new Error('Ticket not found');
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw new Error('Error creating ticket. Please try again.');
  }
}

export const fetchTicketsByUser = async (userId: string) => {
  const userTicketsRef = collection(Firebase_Firestore, `users/${userId}/ticket-purchase`);
  
  const querySnapshot = await getDocs(userTicketsRef);
  const ticketIds = querySnapshot.docs.map((doc) => doc.id);

  const tickets = await Promise.all(
    ticketIds.map(async (ticketId) => {
      const ticketDocRef = doc(Firebase_Firestore, `tickets`, ticketId);
      const ticketDoc = await getDoc(ticketDocRef);
      return { ticketId: ticketDoc.id, ...ticketDoc.data() } as Ticket; 
    })
  );

  return tickets;
};


// Firebase Firestore (CHAT)

const createConversationId = async (
  userId_1: string, 
  userId_2: string,
) => {
  try {
    const conversationRef = collection(Firebase_Firestore, 'conversations');

    const newConversationRef = await addDoc(conversationRef, {
      participants: [userId_1, userId_2],
      dateCreated: Timestamp.now(),
      lastMessage: "",
      lastMessageTimestamp: Timestamp.now(),
    });

    const newConversationId = newConversationRef.id;

    await addConversationToUser(userId_1, userId_2, newConversationId);
    await addConversationToUser(userId_2, userId_1, newConversationId);

    return newConversationId;
  } catch (error) {
    console.log("Error getting/creating conversation:", error);
    throw error; 
  }
};

const addConversationToUser = async (
  userId: string, 
  otherUserId: string, 
  conversationId: string
) => {
  try {
    const userConversationsRef = collection(Firebase_Firestore, `users/${userId}/user-conversations`);

    await setDoc(doc(userConversationsRef, otherUserId), {
      conversationId: conversationId,
      isRead: false,
    });
  } catch (error) {
    console.log(`Error adding conversation to user (${userId}):`, error);
  }
};

const updateConversation = async (conversationId: string, lastMessage: string) => {
  try {
    const conversationRef = doc(Firebase_Firestore, 'conversations', conversationId); 
    await updateDoc(conversationRef, {
      lastMessage: lastMessage,
      lastMessageTimestamp: Timestamp.now(),
    });
  } catch (error) {
    console.log("Error updating conversation:", error);
  }
};

export const updateUserConversationStatus = async (
  userId: string, 
  otherUserId: string, 
  status: boolean
) => {
  try {
    const userConversationsRef = collection(Firebase_Firestore, `users/${userId}/user-conversations`);
    const conversationDocRef = doc(userConversationsRef, otherUserId);

    await updateDoc(conversationDocRef, {
      isRead: status,
    });
  } catch (error) {
    console.log("Error updating user conversation status:", error);
  }
};

export const sendMessage = async (
  senderId: string, 
  recipientId: string,
  conversationId: string | null, 
  messageText: string,
) => {
  try {
    const currentConversationId = conversationId 
      || await createConversationId(senderId, recipientId);

    const messagesRef = collection(Firebase_Firestore, 'conversations', currentConversationId, 'messages');

    const message: Message = {
      id: messagesRef.id,
      text: messageText,
      timestamp: Timestamp.now(),
      senderId: senderId,
      recipientId: recipientId,
    };
    await addDoc(messagesRef, message);

    await updateConversation(currentConversationId, messageText);
    await updateUserConversationStatus(senderId, recipientId, true);
    await updateUserConversationStatus(recipientId, senderId, false);

    return currentConversationId
  } catch (error) {
    console.log("Error sending message:", error);
    throw error;
  }
};

export const fetchConversationIdByUserIds = async (
  senderId: string,
  recipientId: string
) => {
  try {
    const recipientDocRef = doc(
      Firebase_Firestore, 
      `users/${senderId}/user-conversations/${recipientId}`
    );

    const docSnapshot = await getDoc(recipientDocRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data().conversationId || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching conversation ID:", error);
    throw error; // Throw the error to handle upstream if needed
  }
}

export const listenToConversations = (
  currentUserId: string,
  onConversationsUpdated: (conversations: Conversation[]) => void
) => {
  const userConversationsRef = collection(Firebase_Firestore, `users/${currentUserId}/user-conversations`);

  const unsubscribe = onSnapshot(
    userConversationsRef,
    async (snapshot) => {
      const promises = snapshot.docs.map(async (docSnapshot) => {
        const conversationId = docSnapshot.data().conversationId;

        const conversationRef = doc(Firebase_Firestore, 'conversations', conversationId);
        const conversationSnapshot = await getDoc(conversationRef);

        if (conversationSnapshot.exists()) {
          const conversationData = conversationSnapshot.data();
          const participants = conversationData.participants;

          const recipientId = participants.find((id: string) => id !== currentUserId);
          const recipientProfile = recipientId ? await fetchUserProfileById(recipientId) : undefined;

          const isRead = docSnapshot.data()?.isRead;

          return {
            id: conversationId,
            lastMessage: conversationData.lastMessage || '',
            lastMessageTimestamp: conversationData.lastMessageTimestamp || Timestamp.now(),
            isRead: isRead,
            participants: participants,
            recipient: recipientProfile,
          };
        }
        return null; // Filter out invalid conversations
      });

      // Resolve all promises in parallel
      const conversations = (await Promise.all(promises)).filter(Boolean) as Conversation[];

      // Sort conversations by timestamp in descending order
      conversations.sort((a, b) => {
        const aTime = a.lastMessageTimestamp.toDate().getTime();
        const bTime = b.lastMessageTimestamp.toDate().getTime();
        return bTime - aTime;
      });

      onConversationsUpdated(conversations);
    },
    (error) => {
      console.error("Error listening to conversations:", error);
    }
  );

  return unsubscribe; // Return unsubscribe function to stop the listener when needed
};

export const fetchMessagesByConversationId = (
  conversationId: string,
  onMessagesUpdated: (messages: Message[]) => void
) => {
  const messagesRef = collection(Firebase_Firestore, 'conversations', conversationId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(
    messagesQuery,
    async (querySnapshot) => {
      const messagesWithSenders = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data();

          const message = {
            id: doc.id,
            ...messageData
          } as Message;

          try {
            message.sender = await fetchUserProfileById(messageData.senderId);
          } catch (error) {
            console.error(`Error fetching sender for message ${message.id}:`, error);
          }
          
          return message;
        })
      );

      onMessagesUpdated(messagesWithSenders);
    },
    (error) => {
      console.error("Error listening to messages:", error);
    }
  );

  return unsubscribe; // Call this to stop listening
};

export const sendMessageToEvent = async (
  senderId: string,
  eventId: string, 
  messageText: string
) => {
  try {
    const messagesRef = collection(Firebase_Firestore, 'events', eventId, 'event-messages');
    
    const message: Message = {
      id: '', 
      text: messageText,
      timestamp: Timestamp.now(),
      senderId: senderId,
      recipientId: eventId, 
    };

    await addDoc(messagesRef, message);
  } catch (error) {
    console.error("Error sending message to event:", error);
    throw error;
  }
};

export const fetchEventBasedMessages = (
  eventId: string,
  onMessagesUpdated: (messages: Message[]) => void
) => {
  const messagesRef = collection(Firebase_Firestore, 'events', eventId, 'event-messages');

  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(
    messagesQuery,
    async (querySnapshot) => {
      const messagesWithSenders = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const messageData = doc.data();

          const message = {
            id: doc.id,
            ...messageData,
          } as Message;

          try {
            message.sender = await fetchUserProfileById(messageData.senderId);
          } catch (error) {
            console.error(`Error fetching sender for message ${message.id}:`, error);
          }

          return message;
        })
      );

      onMessagesUpdated(messagesWithSenders); // Pass the updated messages to the callback
    },
    (error) => {
      console.error("Error listening to event messages:", error);
    }
  );

  return unsubscribe;
};

export const signInWithGoogle = async (idToken: string, accessToken: string) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(Firebase_Auth, credential);
    const user = await fetchUserProfileById(userCredential.user.uid);

    useUserStore.getState().setUser(user);

    return { user };
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    throw new Error('Google Sign-In failed. Please try again.');
  }
};