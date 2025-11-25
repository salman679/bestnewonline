import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axiosInstanace';

function useFetchPixel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPixel() {
      try {
        const response = await axiosInstance.get('/facebook-pixel');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPixel();
  }, []);

  return { data, loading, error };
}

export default useFetchPixel;
