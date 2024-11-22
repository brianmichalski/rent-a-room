'use client'; // Ensure the component is client-side for API requests

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { BathroomType, Gender, RoomType } from '@prisma/client'; // Import enums from Prisma
import Image from 'next/image'; // To load images in Next.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Breadcrumb from '../components/breadcrumb';

interface Room {
  id: number;
  roomType: RoomType;
  bathroomType: BathroomType;
  gender: Gender;
  description: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  isRented: boolean;
  createdAt: string;
}

interface RoomWithCover extends Room {
  coverImageUrl: string;
}

const MyAds = () => {
  const [rooms, setRooms] = useState<RoomWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Fetch all rooms from the API
        const roomsResponse = await fetch('/api/room/my-rooms');
        const roomsData: Room[] = await roomsResponse.json();

        // Fetch cover image for each room
        const roomsWithCover = await Promise.all(
          roomsData.map(async (room) => {
            const coverResponse = await fetch(`/api/room/${room.id}/cover`);
            const coverImageUrl = await coverResponse.text(); // Assuming the cover image URL is returned as a text

            return { ...room, coverImageUrl };
          })
        );

        setRooms(roomsWithCover);
      } catch (error) {
        console.error('Error fetching rooms data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb breadcrumbs={[{ href: '/', label: '' }, { href: '/my-ads', label: 'My Ads' }]} />
      <h1 className="text-3xl font-semibold mb-6">My Ads</h1>
      {loading ? <div>Loading...</div> :
        <>
          <div className='w-full flex mb-6'>
            <Link href={'my-ads/new'}
              title='Add new room'
              className='p-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'>
              <PlusCircleIcon width={24} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-700">
                  <th className="px-4 py-2">Cover</th>
                  <th className="px-4 py-2">Room Type</th>
                  <th className="px-4 py-2">Bathroom Type</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Rent Price</th>
                  <th className="px-4 py-2">Size (m²)</th>
                  <th className="px-4 py-2">Number of Rooms</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id} className="border-b border-gray-200">
                    <td className="px-4 py-2">
                      <Image
                        src={room.coverImageUrl}
                        alt="Room Cover"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                    </td>
                    <td className="px-4 py-2">{room.roomType}</td>
                    <td className="px-4 py-2">{room.bathroomType}</td>
                    <td className="px-4 py-2">{room.gender}</td>
                    <td className="px-4 py-2">{room.rentPrice.toFixed(2)} CAD</td>
                    <td className="px-4 py-2">{room.size}</td>
                    <td className="px-4 py-2">{room.numberOfRooms}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-sm font-semibold rounded-lg ${room.isRented ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                        {room.isRented ? 'Rented' : 'Available'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}
    </div>
  );
};

export default MyAds;