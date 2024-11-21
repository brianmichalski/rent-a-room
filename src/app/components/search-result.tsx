// pages/index.tsx
import RoomCard from './room-card';

interface Room {
  size: string;
  address: string;
  price: number;
}

const rooms: Room[] = [
  { size: '20m²', address: '120 King St, Waterloo, ON', price: 500 },
  { size: '25m²', address: '220 Queen St, Waterloo, ON', price: 550 },
  { size: '30m²', address: '330 Duke St, Waterloo, ON', price: 600 },
  { size: '20m²', address: '120 King St, Waterloo, ON', price: 500 },
  { size: '25m²', address: '220 Queen St, Waterloo, ON', price: 550 },
  { size: '30m²', address: '330 Duke St, Waterloo, ON', price: 600 },
  { size: '20m²', address: '120 King St, Waterloo, ON', price: 500 },
  { size: '25m²', address: '220 Queen St, Waterloo, ON', price: 550 },
  { size: '30m²', address: '330 Duke St, Waterloo, ON', price: 600 },
  // Add more rooms as necessary
];
interface SearchResultProps {
  results: { name: string; category: string }[];
}

const SearchResult: React.FC<SearchResultProps> = ({ results }) => {
  return (
    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-6 py-6 px-20">
      {rooms.map((room, index) => (
        <RoomCard key={index} room={room} />
      ))}
    </div>
  );
};

export default SearchResult;
