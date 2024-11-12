import { Firebase_Auth } from "@/configs/firebase";
import 'react-native-get-random-values';
import { Link, Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Index() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(Firebase_Auth, (user) => {
      if (user) {
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
