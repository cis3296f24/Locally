import { Firebase_Auth, Firebase_Firestore } from "@/configs/firebase";
import { User, Event } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { removeCurrentUser, saveCurrentUser } from "./storage-service";

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
      isSubscribed: false,
      profileImage: "",
    }

    await updateUserProfile(user);
    await saveCurrentUser(user);

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
    
    await saveCurrentUser(user);

    return { user }; 
  } catch (error) {
    throw new Error('Invalid credentials. Please check your email or password.');
  }
};

export const signOutUser = async () => {
  try {
    await Firebase_Auth.signOut();
    await removeCurrentUser();
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
  const cityQuery = query(eventsCollectionRef, where("city", "==", city));
  const querySnapshot = await getDocs(cityQuery);

    const events = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Event[];

  return events;
};