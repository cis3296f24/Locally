import { bookmarkEvent, fetchUserProfileById, unbookmarkEvent } from "@/services/firebase-service";
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
      useEventStore.getState().setSelectedEvent(event);
  }
}

export const handleBookmark = async (event: Event) => {
  if (!event) return;

  try {
    if (event.isBookmarked) {
      console.log('Unbookmarking event');
      await unbookmarkEvent(event.id);
    } else {
      console.log('Bookmarking event');
      await bookmarkEvent(event.id);
    }

    // Update the selected event state
    const updatedEvent = { ...event, isBookmarked: !event.isBookmarked };
    useEventStore.getState().setSelectedEvent(updatedEvent);

    // Update the event in the global event list state
    const events = useEventStore.getState().events;
    const updatedEvents = events.map((existingEvent) => 
      existingEvent.id === event.id ? updatedEvent : existingEvent
    );

    // Set the updated events list in the store
    useEventStore.getState().setEvents(updatedEvents);

  } catch (error) {
    console.error("Error handling bookmark:", error);
  }
}