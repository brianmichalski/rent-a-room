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
  const [favoriteRooms, setFavoriteRooms] = useState<Set<number>>(new Set());

  // Fetch room data based on filters and sorting
  const fetchResults = async () => {
    const sortParams = sort.split('.');
    const res = await fetch(`/api/room/?cityId=${city?.id}&filter=${filter}&sortBy=${sortParams[0]}&sortDir=${sortParams[1]}`);
    const data = await res.json();
    setResults(data);
  };

  useEffect(() => {
    fetchResults();
  }, [filter, sort, city]);

  const toggleFavorite = (roomId: number) => {
    if (favoriteRooms.has(roomId)) {
      setFavoriteRooms(new Set([...favoriteRooms].filter(id => id !== roomId)));
      fetch(`/api/room/${roomId}/unfavorite`, { method: "PUT" });
    } else {
      setFavoriteRooms(new Set(favoriteRooms.add(roomId)));
      fetch(`/api/room/${roomId}/favorite`, { method: "PUT" });
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
