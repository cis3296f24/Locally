import { Firebase_Auth, Firebase_Firestore, Firebase_Storage } from "@/configs/firebase";
import { User, Event, Ticket, Message, Conversation } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, orderBy, startAt, endAt, where, GeoPoint, limit, Timestamp, updateDoc, onSnapshot } from "firebase/firestore";
import { useUserStore } from "@/store/user";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

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
      username: fullName.split(' ')[0].toLowerCase(),
      isSubscribed: false,
      profileImage: "",
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
    const user = await fetchUserProfile(userCredential.user.uid);
    
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

export const fetchUserProfile = async (userId: string) => {
  const userRef = doc(Firebase_Firestore, 'users', userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error('User not found');
  }

  return userSnapshot.data() as User;
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
    console.error("Error fetching users:", error);
    throw error;
  }
};


// Firebase Firestore (EVENTS)

export const fetchEventsByCity = async (city: string) => {
  const eventsCollectionRef = collection(Firebase_Firestore, "events");

  const cityQuery = query(
    eventsCollectionRef, 
    where("city", "==", city)
  );
  const querySnapshot = await getDocs(cityQuery)

  const eventsWithOwners = await Promise.all(
    querySnapshot.docs
      .filter((doc) => {
        return doc.data().dateStart.toDate() >= new Date();
      })
      .map(async (doc) => {
        const event = {
          id: doc.id,
          ...doc.data(),
        } as Event;

        try {
          event.owner = await fetchUserProfile(event.ownerId);
          // console.log(event.owner.fullName);
        } catch (error) {
          console.error(`Error fetching owner for event ${event.id}:`, error);
        }

        return event;
      }
    )
  );

  return eventsWithOwners;
};

// Firebase Firestore (TICKETS)

export const createTicket = async (
  event: Event,
  user: User,
  numTickets: number,
  total: string
) => {
  try {
    const ticketRef = doc(collection(Firebase_Firestore, 'tickets'));

    const newTicket: Ticket = {
      ticketId: ticketRef.id,
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

    const ticketId = newTicket.ticketId;
    console.log('Ticket created with Firestore-generated ID:', ticketId);

    await setDoc(ticketRef, newTicket);

    const eventTicketRef = doc(Firebase_Firestore, `events/${event.id}/ticket-purchase`, ticketId);
    await setDoc(eventTicketRef, newTicket);

    // Add ticket to the user's 'ticket-purchase' subcollection
    const userTicketRef = doc(Firebase_Firestore, `users/${user.id}/ticket-purchase`, ticketId);
    await setDoc(userTicketRef, newTicket);

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

  const tickets = querySnapshot.docs.map((doc) => {
    return doc.data() as Ticket;
  });

  return tickets;
}


// Firebase Firestore (CHAT)

const getConversationId = async (
  userId_1: string, 
  userId_2: string,
  conversationId: string
) => {
  try {
    const conversationRef = collection(Firebase_Firestore, 'conversations')

    const conversationDocRef = doc(conversationRef, conversationId);
    const docSnapshot = await getDoc(conversationDocRef);

    if (docSnapshot.exists()) {
      return docSnapshot.id;
    }

    const newConversationRef = await addDoc(conversationRef, {
      participants: [userId_1, userId_2],
      dateCreated: Timestamp.now(),
      lastMessage: "",
      lastMessageTimestamp: Timestamp.now(),                               
    });

    const newConversationId = newConversationRef.id;

    await addConversationToUser(userId_1, newConversationId);
    await addConversationToUser(userId_2, newConversationId);

    return newConversationId;
  } catch (error) {
    console.log("Error getting/creating conversation:", error);
    throw error; 
  }
};

const addConversationToUser = async (userId: string, conversationId: string) => {
  try {
    const userConversationsRef = collection(Firebase_Firestore, `users/${userId}/user-conversations`);

    await setDoc(doc(userConversationsRef, conversationId), {
      conversationId: conversationId,
      isRead: false
    });
  } catch (error) {
    console.log("Error adding conversation to user:", error);
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
  conversationId: string, 
  status: boolean
) => {
  try {
    const userConversationsRef = collection(Firebase_Firestore, `users/${userId}/user-conversations`);
    const conversationDocRef = doc(userConversationsRef, conversationId);

    // Set 'isRead' to false for the recipient in the user-conversations subcollection
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
  conversationId: string, 
  messageText: string
) => {
  try {
    const currentConversationId = await getConversationId(senderId, recipientId, conversationId);

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
    await updateUserConversationStatus(recipientId, currentConversationId, false);
    await updateUserConversationStatus(senderId, currentConversationId, true);

    return currentConversationId
  } catch (error) {
    console.log("Error sending message:", error);
    throw error;
  }
};

export const listenToConversations = (
  currentUserId: string,
  onConversationsUpdated: (conversations: Conversation[]) => void
) => {
  const userConversationsRef = collection(Firebase_Firestore, `users/${currentUserId}/user-conversations`);

  const unsubscribe = onSnapshot(
    userConversationsRef,
    async (snapshot) => {
      const conversations: Conversation[] = [];

      for (const docSnapshot of snapshot.docs) {
        const conversationId = docSnapshot.id;

        const conversationRef = doc(Firebase_Firestore, 'conversations', conversationId);
        const conversationSnapshot = await getDoc(conversationRef);

        if (conversationSnapshot.exists()) {
          const conversationData = conversationSnapshot.data();
          const participants = conversationData.participants;

          const recipientId = participants.find((id: string) => id !== currentUserId);
          const recipientProfile = recipientId ? await fetchUserProfile(recipientId) : undefined;

          const isRead = docSnapshot.data()?.isRead;

          const conversation: Conversation = {
            id: conversationId,
            lastMessage: conversationData.lastMessage || '',
            lastMessageTimestamp: conversationData.lastMessageTimestamp || Timestamp.now(),
            isRead: isRead,
            participants: participants,
            recipient: recipientProfile,
          };

          conversations.push(conversation);
        }
      }
      
      conversations.sort((a, b) => {
        const aTime = a.lastMessageTimestamp.toDate().getTime();
        const bTime = b.lastMessageTimestamp.toDate().getTime();
        return bTime - aTime; // Descending order
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
            message.sender = await fetchUserProfile(messageData.senderId);
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