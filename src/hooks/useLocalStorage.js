import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  // Initialize state with a function to handle SSR and lazy initialization
  const [state, setState] = useState(() => {
    try {
      // Check if window is available (for SSR)
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        // Parse stored json or return defaultValue
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    try {
      // Check if window is available (for SSR)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [key, state]);

  return [state, setState];
}

export default useLocalStorage; 