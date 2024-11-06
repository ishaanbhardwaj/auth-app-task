import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/constants';
import { useAuth } from '../context/AuthContext';

export const useAuthCheck = () => {
  const { setIsAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_BASE_URL}/auth/check`, {
          withCredentials: true
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated]);

  return { isLoading };
}; 