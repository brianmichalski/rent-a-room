// src/hooks/useProvinces.ts
import { useEffect, useState } from 'react';

interface Province {
  id: number;
  name: string;
}

const useProvinces = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('/api/city/provinces');
        if (!response.ok) {
          throw new Error('Failed to fetch provinces');
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return { provinces, isLoading };
};

export default useProvinces;
