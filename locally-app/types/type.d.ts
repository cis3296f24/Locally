interface CategoryCardProps { // use this to define the types for the arguments
    label: string; 
    iconName: any;
}

interface MapProps {
  onMarkerSelect: (event: Event) => void;
}

// CardPop.tsx
interface Event {
  id: number;
  title: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  emote: string;
  category: string;
}

interface CardPopProps {
  event: Event;
  styling?: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Candlelight Fine Dining",
    coordinate: {
      latitude: 39.965519,
      longitude: -75.181053,
    },
    emote: "🍽️",
    category: "dining"
  },
  {
    id: 2,
    title: "Art Exhibition",
    coordinate: {
      latitude: 39.9526,
      longitude: -75.1652,
    },
    emote: "🎨",
    category: "exhibition"
  },
]