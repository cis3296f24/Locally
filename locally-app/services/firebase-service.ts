import { Firebase_Auth } from "@/configs/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const signUpUser = async ({ 
  email, 
  password 
}: {
  email: string;
  password: string;
}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(Firebase_Auth, email, password);
    const user = userCredential.user;
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