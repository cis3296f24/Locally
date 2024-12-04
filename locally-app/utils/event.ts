import { bookmarkEvent, fetchBookmarkedEventsByUserId, fetchUserProfileById, unbookmarkEvent } from "@/services/firebase-service";
import { useEventStore } from "@/store/event";
import { useUserStore } from "@/store/user";
import { Event, User } from "@/types/type";

export const updateSelectedEvent = async (event: Event) => {
  try {
    const owner = await fetchUserProfileById(event.ownerId);

    let updatedEvent = { ...event };

    if (updatedEvent.attendeeIds && updatedEvent.attendeeIds.length > 2) {
      const shuffledIds = [...updatedEvent.attendeeIds].sort(() => 0.5 - Math.random());
      const selectedIds = shuffledIds.slice(0, 3);

      const attendeesList: User[] = await Promise.all(
        selectedIds.map(async (id) => fetchUserProfileById(id))
      );

      updatedEvent = { ...updatedEvent, attendees: attendeesList };
    }

    updatedEvent = { ...updatedEvent, owner };

    useEventStore.getState().setSelectedEvent(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

export const handleBookmark = async (
  event: Event | null, 
  isBookmarked: boolean
) => {
  if (!event) return;

  const { user, userBookmarkedEvents, setUserBookmarkedEvents } = useUserStore.getState();

  try {
    if (isBookmarked) {
      console.log('Unbookmarking event');
      await unbookmarkEvent(event.id);

      // const updatedBookmarkedEvents = userBookmarkedEvents.filter(
      //   (bookmarkedEvent) => bookmarkedEvent.id !== event.id
      // );
    } else {
      console.log('Bookmarking event');
      await bookmarkEvent(event.id);

      // const updatedBookmarkedEvents = [...userBookmarkedEvents, event];
    }

    const updatedBookmarkedEvents = await fetchBookmarkedEventsByUserId(user?.id as string);
    setUserBookmarkedEvents(updatedBookmarkedEvents);

    return !isBookmarked;
  } catch (error) {
    console.error("Error handling bookmark:", error);
    return false
  }
}