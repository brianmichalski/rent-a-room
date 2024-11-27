import React, { useState } from 'react';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { RoomResult } from '../../../types/results';

interface RoomCardProps {
  room: RoomResult;
  favoriteRooms: number[];
  onToggleFavorite: (id: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, favoriteRooms, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = room.pictures.length;

  const handleImageChange = (index: number) => setCurrentImageIndex(index);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative">
        <div className="flex justify-center items-center">
          <img
            src={room.pictures[currentImageIndex] || "/default-image.jpg"}
            alt="Room"
            className="w-full h-60 object-cover rounded-md"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full flex justify-center py-2 space-x-2">
          {room.pictures.map((_, index: number) => (
            <div
              key={index}
              onClick={() => handleImageChange(index)}
              className={`w-2.5 h-2.5 bg-gray-400 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-yellow-500' : ''}`}
            />
          ))}
        </div>
        <HeartIcon
          fill={favoriteRooms.includes(room.id) ? 'red' : 'white'}
          fillOpacity={favoriteRooms.includes(room.id) ? '90%' : '80%'}
          className={`absolute top-2 right-2 h-7 w-7 cursor-pointer ${favoriteRooms.includes(room.id) ? 'text-red-300' : 'text-gray-100'}`}
          onClick={() => onToggleFavorite(room.id)}
        />
      </div>
      <h3 className="mt-2 text-xl font-semibold">{`${room.number} ${room.street}`}</h3>
      <p className="text-sm text-gray-500">{room.size} m²</p>
      <p className="text-lg font-semibold mt-2">${room.rentPrice}</p>
    </div>
  );
};

export default RoomCard;
