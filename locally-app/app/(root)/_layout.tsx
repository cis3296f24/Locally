import { Stack } from "expo-router";

const CoreLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event-details" options={{ headerShown: false }} />
      <Stack.Screen name="purchase-screen" options={{ headerShown: false }} />
      <Stack.Screen name="ticket-screen" options={{ headerShown: false }} />
    </Stack>
  );
};

export default CoreLayout;