"use client";

import { useEffect, useState } from "react";
import { CityResult, RoomResult } from "../types/results";
import FilterAndSort from "./components/search/filter-and-sort";
import SearchResult from "./components/search/search-result";
import { SelectOption } from "../types/forms";

const Home: React.FC = () => {
  const sortOptions: SelectOption[] = [
    {
      description: 'Price: Low to High',
      value: 'price.asc'
    },
    {
      description: 'Price: High to Low',
      value: 'price.desc'
    },
    {
      description: 'Size: Smaller first',
      value: 'size.asc'
    },
    {
      description: 'Size: Bigger first',
      value: 'size.desc'
    }
  ];
  const [filter, setFilter] = useState<string>("");
  const [sort, setSort] = useState<string>(sortOptions[0].value);
  const [city, setCity] = useState<CityResult | undefined>();
  const [results, setResults] = useState<RoomResult[]>([]);
  const [favoriteRooms, setFavoriteRooms] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch room data based on filters and sorting
  const fetchResults = async () => {
    const sortParams = sort.split('.');
    const res = await fetch(`/api/room/?cityId=${city?.id}&filter=${filter}&sortBy=${sortParams[0]}&sortDir=${sortParams[1]}`);
    const data = await res.json();
    setResults(data);
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/room/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      setFavoriteRooms(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    fetchResults();
  }, [filter, sort, city]);

  const toggleFavorite = (roomId: number) => {
    if (!favoriteRooms) {
      return;
    }
    if (favoriteRooms?.includes(roomId)) {
      setFavoriteRooms([...favoriteRooms].filter(id => id !== roomId));
      fetch(`/api/room/${roomId}/favorite`, { method: "DELETE" });
    } else {
      setFavoriteRooms([...favoriteRooms, roomId]);
      fetch(`/api/room/${roomId}/favorite`, { method: "POST" });
    }
  };

  return (
    <>
      <FilterAndSort
        onFilter={setFilter}
        onSort={setSort}
        onCityChange={setCity}
        sortOptions={sortOptions}
      />
      <SearchResult
        results={results}
        favoriteRooms={favoriteRooms}
        onToggleFavorite={toggleFavorite}
      />
    </>
  );
};

export default Home;
