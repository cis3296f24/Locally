import { Firebase_Auth } from "@/configs/firebase";
import { fetchAllUsers, fetchBookmarkedEventsByUserId, fetchTicketsByUser, fetchCreatedEventsByUserId, fetchUserProfileById, fetchEventById, fetchEventsWithMessagesForUser } from "@/services/firebase-service";
import { useUserStore } from "@/store/user";
import 'react-native-get-random-values';
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useTicketStore } from "@/store/ticket";
import registerNNPushToken from 'native-notify';
import useNativeNotify from "@/services/native-notify";

export default function Index() {
  registerNNPushToken(25151, 'bdWU0reHJ0TDNushqXwyuJ');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { registerDevice, registerFollowMaster } = useNativeNotify();

  useEffect(() => {
    onAuthStateChanged(Firebase_Auth, async (user) => {
      if (user) {
        const [
          currentuser,
          users,
          bookmarkEvents,
          createdEvents,
          ticketList,
          messagesEvents
        ] = await Promise.all([
          fetchUserProfileById(user.uid),
          fetchAllUsers(),
          fetchBookmarkedEventsByUserId(user.uid),
          fetchCreatedEventsByUserId(user.uid),
          fetchTicketsByUser(user.uid),
          fetchEventsWithMessagesForUser(user.uid)
        ]);

        useUserStore.getState().setUser(currentuser);
        useUserStore.getState().setUserList(users);
        useUserStore.getState().setUserBookmarkedEvents(bookmarkEvents);
        useUserStore.getState().setUserCreatedEvents(createdEvents);
        useUserStore.getState().setUserMessagesEvents(messagesEvents);
        useTicketStore.getState().setTicketList(ticketList);
        registerDevice(user.uid);
        registerFollowMaster(user.uid);

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


