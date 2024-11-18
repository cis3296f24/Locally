import { Firebase_Auth, Firebase_Firestore, Firebase_Storage } from "@/configs/firebase";
import { User, Event, Ticket } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
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
  const ticketId = `${user.id}_${event.id}`;
  console.log('Ticket ID', ticketId);

  const ticketRef = doc(Firebase_Firestore, 'tickets', `${ticketId}`);

  const newTicket: Ticket = {
    ticketId,
    eventName: event.title,
    eventAddress: `${event.street}, ${event.city}, ${event.state} ${event.zipCode}`,
    userName: user.fullName,
    orderNumber: `#${Math.floor(Math.random() * 100000)}`,
    date: event.dateStart,
    time: event.timeStart,
    numTickets: numTickets,
    total: total,
    eventImage: event.coverImage,
    qrcode: `${event.title}, ${user.fullName}`,

    eventId: event.id,
    userId: user.id,
  };

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
}