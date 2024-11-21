import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Link} from 'expo-router';
import { Ticket } from '@/types/type';
import { fetchTicketsByUser } from '@/services/firebase-service';
import { useUserStore } from '@/store/user';

const Luis = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchUserTickets = async () => {
      // Replace with the actual user ID (e.g., from authentication context)
      const userId = user?.id; // Placeholder for actual user ID
      const fetchedTickets = await fetchTicketsByUser(userId ?? "");
      setTickets(fetchedTickets); // Store the fetched tickets in state
    };

    fetchUserTickets(); // Fetch tickets
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <View className="bg-[#003566] p-4 rounded-md">
        <Text className="text-white text-lg font-bold">Luis</Text>
        <Link href="/event-details">
          <Text>Concert Event Example</Text>
        </Link>
      </View>

      <View className="mt-4">
        {/* Render the tickets */}
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <View key={index} className="bg-gray-100 p-4 rounded-md my-2">
              <Text className="text-xl font-semibold">{ticket.eventName}</Text>
            </View>
          ))
        ) : (
          <Text>No tickets purchased</Text>
        )}
      </View>
    </View>
  )
}

export default Luis