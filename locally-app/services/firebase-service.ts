import { Firebase_Auth, Firebase_Firestore } from "@/configs/firebase";
import { User } from "@/types/type";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
    const user = userCredential.user;

    await updateUserProfile({
      id: user.uid,
      email,
      fullName,
      isSubscribed: false,
      profileImage: "",
    });

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
    const user = userCredential.user;
    
    return { user }; 
  } catch (error) {
    throw new Error('Invalid credentials. Please check your email or password.');
  }
};

export const signOutUser = async () => {
  try {
    await Firebase_Auth.signOut();
    return true
  } catch (error) {
    console.error("Error signing out:", error);
    return false
  }
}

// Firebase Firestore

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