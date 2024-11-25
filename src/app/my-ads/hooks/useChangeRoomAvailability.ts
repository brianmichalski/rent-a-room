import { RoomWithCover } from "../types";

export const useChangeRoomAvailability = (setRooms: React.Dispatch<React.SetStateAction<RoomWithCover[]>>) => {

  const handleChangeRoomAvailability = async (id: number) => {
    try {
      const response = await fetch(`/api/room/${id}/availability`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to change the room.');
      }

      // Optimistically update the room's availability in the state
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === id
            ? { ...room, isRented: !room.isRented } // Toggle the availability status
            : room
        )
      );
    } catch (error) {
      console.error('Error changing room:', error);
    }
  };

  return {
    handleChangeRoomAvailability
  }
};
