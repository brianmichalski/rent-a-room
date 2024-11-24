// hooks/useRooms.ts

import { Room } from '@prisma/client';
import { useEffect, useState } from 'react';

interface RoomWithCover {
  id: number;
  roomType: string;
  bathroomType: string;
  gender: string;
  rentPrice: number;
  size: number;
  numberOfRooms: number;
  isRented: boolean;
  coverImageUrl: string;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<RoomWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const roomsResponse = await fetch('/api/room/my-rooms');
      const roomsData = await roomsResponse.json();

      const roomsWithCover = await Promise.all(
        roomsData.map(async (room: Room) => {
          const coverResponse = await fetch(`/api/room/${room.id}/cover`);
          const coverImageUrl = await coverResponse.text();
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

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, loading, fetchRooms };
};
