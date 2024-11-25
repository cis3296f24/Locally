import { Firebase_Auth } from "@/configs/firebase";
import { fetchUserProfileById } from "@/services/firebase-service";
import { useUserStore } from "@/store/user";
import 'react-native-get-random-values';
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Index() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(Firebase_Auth, async (user) => {
      if (user) {
        const currentuser = await fetchUserProfileById(user.uid);
        useUserStore.getState().setUser(currentuser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    })
  }, [])

  if (!isLoading) {
    if (isLoggedIn) {
      return <Redirect href='/(root)/(tabs)/explore' />
    } else {
      return <Redirect href='./(auth)/login' />
    }
  }
}
