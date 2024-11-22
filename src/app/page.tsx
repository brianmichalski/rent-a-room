"use client";

import { useState } from "react";
import FilterAndSort from "../app/components/filter-and-sort";
import SearchResult from "../app/components/search-result";

const Home: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("asc");
  const [results, setResults] = useState<{ name: string; category: string }[]>([]);
  return (
    <>
      <FilterAndSort onFilter={setFilter} onSort={setSort} />
      <SearchResult results={results} />
    </>
  );
};

export default Home;