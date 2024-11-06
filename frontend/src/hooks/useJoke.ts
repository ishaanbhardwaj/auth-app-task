import { useState } from 'react';
import axios from 'axios';

interface Joke {
  type: string;
  setup: string;
  punchline: string;
  id: number;
}

export const useJoke = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [showPunchline, setShowPunchline] = useState(false);

  const fetchJoke = async () => {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      setJoke(response.data);
      setShowPunchline(false);
    } catch (error) {
      console.error('Error fetching joke:', error);
    }
  };

  return { joke, showPunchline, setShowPunchline, fetchJoke };
}; 