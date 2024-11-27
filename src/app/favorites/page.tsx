'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RoomResult } from '../../types/results';
import Breadcrumb from '../components/layout/breadcrumb';

export default function FavoriteRooms() {
  const [rooms, setRooms] = useState<RoomResult[]>([]);

  useEffect(() => {
    // Fetch favorite rooms from the API
    async function fetchRooms() {
      const response = await fetch('/api/room/my-favorites');
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    }

    fetchRooms();
  }, []);

  const handleRemove = async (id: number) => {
    const response = await fetch(`/api/room/${id}/favorite`, { method: "DELETE" });
    if (response.ok) {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
    } else {
      console.error('Failed to remove room from favorites');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-favorites', label: 'Favorites' } ]} />
      <div className='flex gap-x-2 items-center mb-6'>
        <h1 className="text-3xl font-semibold mb-2">Favorite Rooms</h1>
      </div>
      {rooms.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b"></th>
              <th className="px-4 py-2 border-b">Availability</th>
              <th className="px-4 py-2 border-b text-left">Street</th>
              <th className="px-4 py-2 border-b text-left">Number</th>
              <th className="px-4 py-2 border-b">Rent Price</th>
              <th className="px-4 py-2 border-b">Size</th>
              <th className="px-4 py-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-100 h-24">
                <td className="px-4 py-2 border-b text-center">
                  {room.pictures.length > 0 ? (
                    <Image
                      src={room.pictures[0]}
                      alt="Room"
                      width={100}
                      height={60}
                      className="rounded"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <span
                    className={`px-2 py-0.5 font-semibold rounded text-white
                    ${room.isRented ? 'bg-gray-500' : 'bg-green-500'}`}>
                    {room.isRented ? 'Rented' : 'Available'}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">{room.street}</td>
                <td className="px-4 py-2 border-b">{room.number}</td>
                <td className="px-4 py-2 border-b text-center">{`$${room.rentPrice}`}</td>
                <td className="px-4 py-2 border-b text-center">{`${room.size} m²`}</td>
                <td className="px-4 py-2 border-b">
                  <div className='flex space-x-2 w-full justify-end gap-x-2'>
                    <Link title='Go to details' href={`/room-details/${room.id}`} className='px-2 rounded hover:underline hover:text-blue-600'>
                      View details
                    </Link>
                    <button
                      title='Remove Favorite'
                      onClick={() => handleRemove(room.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No favorite rooms found.</p>
      )}
    </div>
  );
}
