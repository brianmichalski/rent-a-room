import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { RoomResult } from '../../../types/results';
import { getBathroomTypeDescription, getGenderDescription, getRoomTypeDescription } from '../../helper/enum.helper';

interface RoomCardProps {
  room: RoomResult;
  favoriteRooms: number[];
  onToggleFavorite: (id: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, favoriteRooms, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (index: number) => setCurrentImageIndex(index);

  const handleImageNavigation = (direction: string) => {
    if (!room?.pictures?.length) return;
    const lastIndex = room.pictures.length - 1;
    setCurrentImageIndex((prevIndex) =>
      direction === 'prev'
        ? (prevIndex === 0 ? lastIndex : prevIndex - 1)
        : (prevIndex === lastIndex ? 0 : prevIndex + 1)
    );
  };

  const isFavorite = favoriteRooms.includes(room.id);
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative">
        <div className="flex justify-center items-center">
          <Link href={`/room-details?id=${room.id}`} title='Go to room details'>
            <Image
              src={room.pictures[currentImageIndex] || "/default-image.jpg"}
              alt="Room"
              className="w-full h-60 object-cover rounded-md"
              layout='contain'
              quality={75}
              width={240}
              height={100}
            />
          </Link>
          {/* Navigation Arrows */}
          <button
            onClick={() => handleImageNavigation('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow hover:text-black"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={() => handleImageNavigation('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-70 hover:opacity-100 hover:shadow hover:text-black "
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full flex justify-center py-2 space-x-2">
          {room.pictures.map((_, index: number) => (
            <div
              key={index}
              title='Switch image'
              onClick={() => handleImageChange(index)}
              className={`w-2.5 h-2.5 bg-gray-400 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-yellow-500' : ''}`}
            />
          ))}
        </div>
        <HeartIcon
          title={isFavorite ? 'Unfavorite' : 'Favorite'}
          fill={isFavorite ? 'red' : 'white'}
          fillOpacity={isFavorite ? '90%' : '80%'}
          className={`absolute top-2 right-2 h-7 w-7 cursor-pointer ${isFavorite ? 'text-red-300' : 'text-gray-100'}`}
          onClick={() => onToggleFavorite(room.id)}
        />
      </div>
      <div className='flex justify-between'>
        <div className="flex flex-col p-2">
          <h4 className="text-xl font-semibold">{`${room.address}`}</h4>
          <p className="text-sm text-gray-500">{room.city}</p>
        </div>
        <div className="flex flex-col items-end p-2">
          <p className="text-md font-semibold">${room.rentPrice}/month</p>
          <p className="text-sm">{room.size} m²</p>
        </div>
      </div>
      <div className='grid grid-cols-3 border-t pt-1'>
        <p className="text-sm text-center">
          <span className='block text-xs text-gray-500'>Type</span>
          {getRoomTypeDescription(room.roomType)}</p>
        <p className="text-sm text-center">
          <span className='block text-xs text-gray-500'>Bathroom</span>
          {getBathroomTypeDescription(room.bathroomType)}
        </p>
        <p className="text-center">
          <span className='block text-xs text-gray-500'>Gender</span>
          {getGenderDescription(room.gender)}
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
