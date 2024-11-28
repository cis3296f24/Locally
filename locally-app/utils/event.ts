import { fetchUserProfileById } from "@/services/firebase-service";
import { useEventStore } from "@/store/event";
import { useUserStore } from "@/store/user";
import { Event, User } from "@/types/type";

export const updateSelectedEvent = async (event: Event) => {
  const owner = await fetchUserProfileById(event.ownerId);
  useUserStore.getState().setSelectedUser(owner);

  if (event.attendeeIds && event.attendeeIds.length > 2) {
      const shuffledIds = [...event.attendeeIds].sort(() => 0.5 - Math.random());
      const selectedIds = shuffledIds.slice(0, 3);

      // Fetch user profiles for selected IDs
      const attendeesList: User[] = await Promise.all(
          selectedIds.map(async (id) => fetchUserProfileById(id))
      );

      // Attach the attendees to the event object
      event = { ...event, attendees: attendeesList };
  }

  useEventStore.getState().setSelectedEvent(event);
}