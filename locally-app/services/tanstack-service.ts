import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchEventsByCity } from "./firebase-service";
import { Event } from "@/types/type";

export const useEventsByCity = (
  city: string,
  forceRemote = false,
  options?: UseQueryOptions<Event[]>
) => {
  return useQuery<Event[], Error>({
    queryKey: ["events", city],
    queryFn: () => fetchEventsByCity(city),
    staleTime: 5 * 60 * 1000,
    networkMode: forceRemote ? "online" : "always",
    ...options,
  });
};