"use client";

import { useEffect, useState } from "react";
import { CityResult, RoomResult } from "../types/results";
import FilterAndSort, { DEFAULT_SORT } from "./components/search/filter-and-sort";
import SearchResult from "./components/search/search-result";

const Home: React.FC = () => {

  const [city, setCity] = useState<CityResult | undefined>();
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [type, setType] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT);
  const [results, setResults] = useState<RoomResult[]>([]);
  const [favoriteRooms, setFavoriteRooms] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const prepareQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (city) {
      queryParams.append('cityId', String(city?.id));
    }
    if (priceRange[0]) {
      queryParams.append('rentPriceMin', String(priceRange[0]));
    }
    if (priceRange[1]) {
      queryParams.append('rentPriceMax', String(priceRange[1]));
    }
    if (type ?? '' !== '') {
      queryParams.append('roomType', type);
    }
    if (gender ?? '' !== '') {
      queryParams.append('gender', gender);
    }
    const sortParams = sortBy?.split('.');
    queryParams.append('sortBy', sortParams[0]);
    queryParams.append('sortDir', sortParams[1]);
    return queryParams.toString();
  }

  const resetFilter = () => {
    setCity(undefined);
    setPriceRange([0, 1000]);
    setType("");
    setGender("");
  }

  // Fetch room data based on filters and sorting
  const fetchResults = async () => {
    const res = await fetch(`/api/room?${prepareQueryParams()}`);
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
  }, [city, priceRange, type, gender, sortBy]);

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
        city={city}
        priceRange={priceRange}
        type={type}
        gender={gender}
        sortBy={sortBy}
        onCityChange={setCity}
        onPriceChange={setPriceRange}
        onTypeChange={setType}
        onGenderChange={setGender}
        onSortChange={setSortBy}
        handleReset={resetFilter}
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
