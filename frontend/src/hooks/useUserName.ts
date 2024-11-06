import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/constants';

export const useUserName = () => {
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/name`, {
          withCredentials: true
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch user name:', error);
        setUserName('');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, []);

  return { userName, isLoading };
}; 