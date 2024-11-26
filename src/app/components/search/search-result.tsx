import React from "react";
import { RoomResult } from "../../../types/results";
import RoomCard from "./room-card"; // Assuming Room type is defined

interface SearchResultProps {
  results: RoomResult[];
  favoriteRooms: Set<number>;
  onToggleFavorite: (id: number) => void;
}

const SearchResult: React.FC<SearchResultProps> = ({ results, favoriteRooms, onToggleFavorite }) => {
  return (
    <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3 lg:gap-6 py-6">
      {results.length > 0 ? (
        results.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            favoriteRooms={favoriteRooms}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-gray-500">No rooms found</div>
      )}
    </div>
  );
};

export default SearchResult;
