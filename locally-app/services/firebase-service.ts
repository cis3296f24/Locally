import { Firebase_Auth, Firebase_Firestore, Firebase_Storage } from "@/configs/firebase";
import { User, Event, Ticket, Message, Conversation } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, orderBy, startAt, endAt, where, GeoPoint, limit, Timestamp, updateDoc } from "firebase/firestore";
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
  userId_2: string
): Promise<string> => {
  try {
    const conversationRef = collection(Firebase_Firestore, 'conversations')

    const conversationQuery = query(
      conversationRef,
      where('participants', 'array-contains', userId_1),
      where('participants', 'array-contains', userId_2)
    );

    const querySnapshot = await getDocs(conversationQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
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
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.log("Error updating conversation:", error);
  }
};

const updateUserConversationStatus = async (
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
  messageText: string
): Promise<void> => {
  try {
    const conversationId = await getConversationId(senderId, recipientId);

    const messagesRef = collection(Firebase_Firestore, 'conversations', conversationId, 'messages');

    const message: Message = {
      id: messagesRef.id,
      text: messageText,
      timestamp: Timestamp.now(),
      senderId: senderId,
      recipientId: recipientId,
    };
    await addDoc(messagesRef, message);

    await updateConversation(conversationId, messageText);
    await updateUserConversationStatus(recipientId, conversationId, false);
    await updateUserConversationStatus(senderId, conversationId, true);

  } catch (error) {
    console.log("Error sending message:", error);
    throw error;
  }
};

export const fetchConversations = async (currentUserId: string) => {
  try {
    const userConversationsRef = collection(Firebase_Firestore, `users/${currentUserId}/user-conversations`);
    const userConversationsSnapshot = await getDocs(userConversationsRef);

    const conversations: Conversation[] = [];

    for (const docSnapshot of userConversationsSnapshot.docs) {
      const conversationId = docSnapshot.id;

      const conversationRef = doc(Firebase_Firestore, 'conversations', conversationId);
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        const conversationData = conversationSnapshot.data();
        const participants = conversationData.participants;

        // Determine the recipient (who is not the current user)
        const recipientId = participants.find((id: string) => id !== currentUserId);
        const recipientProfile = recipientId ? await fetchUserProfile(recipientId) : undefined;

        // Fetch the latest message from the 'messages' subcollection
        // const messagesRef = collection(Firebase_Firestore, 'conversations', conversationId, 'messages');
        // const messagesSnapshot = await getDocs(messagesRef);
        // const messages: Message[] = messagesSnapshot.docs.map(doc => doc.data() as Message);

        // Get the 'isRead' status from the 'user-conversations' subcollection for this user
        const userConversationDoc = doc(Firebase_Firestore, `users/${currentUserId}/user-conversations`, conversationId);
        const userConversationSnapshot = await getDoc(userConversationDoc);
        const isRead = userConversationSnapshot.exists() ? userConversationSnapshot.data()?.isRead : true;

        // Construct the Conversation object
        const conversation: Conversation = {
          id: conversationId,
          lastMessage: conversationData.lastMessage || '',
          lastMessageTimestamp: conversationData.lastMessageTimestamp || Timestamp.now(),
          isRead: isRead,
          participants: participants,
          // messages: messages,
          recipient: recipientProfile,
        };

        conversations.push(conversation);
      }
    }

    return conversations;
  } catch (error) {
    console.log("Error fetching conversations:", error);
    throw error;
  }
};

export const fetchMessagesByConversationId = async (conversationId: string) => {
  try {
    const messagesRef = collection(Firebase_Firestore, 'conversations', conversationId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    const querySnapshot = await getDocs(messagesQuery);

    const messages = querySnapshot.docs.map(async (doc) => {
      const messageData = doc.data();
      const sender = await fetchUserProfile(messageData.senderId);

      return {
        id: doc.id,
        sender: sender,
        ...messageData, 
      };
    });

    return messages;
  } catch (error) {
    console.log("Error fetching messages:", error);
    throw error;
  }
};