// src/hooks/useCities.ts
import { useEffect, useState } from 'react';

interface City {
  id: number;
  name: string;
}

const useCities = (provinceId: number) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      if (!provinceId) return;

      try {
        const response = await fetch(`/api/city/${provinceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [provinceId]);

  return { cities, isLoading };
};

export default useCities;
