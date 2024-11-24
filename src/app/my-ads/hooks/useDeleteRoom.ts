// hooks/useDeleteRoom.ts

import { useState } from 'react';

export const useDeleteRoom = (fetchRooms: () => Promise<void>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteRoom = (id: number) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) return;

    try {
      const response = await fetch(`/api/room/${selectedId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the room.');
      }

      // Reload the rooms after successful deletion
      await fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
    setDialogOpen(false);
  };

  const handleCancelDialog = () => {
    setDialogOpen(false);
  };

  return {
    dialogOpen,
    selectedId,
    handleDeleteRoom,
    handleConfirmDelete,
    handleCancelDialog,
  };
};
