// components/RoomCard.tsx
import React from 'react';

interface Room {
  size: string;
  address: string;
  price: number;
}

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <div className="h-40 bg-gray-200 flex justify-center items-center">Picture</div>
      <div className="p-4">
        <h2 className="text-lg font-bold">{room.size} single bedroom, ensuite</h2>
        <p className="text-gray-600">{room.address}</p>
        <p className="text-gray-800 font-bold">${room.price}</p>
      </div>
    </div>
  );
};

export default RoomCard;
