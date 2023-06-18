import { useState, useEffect, useCallback } from "react";

function useFetchOnMount(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await apiCall();
      setData(data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return [data, loading, error];
}
export default useFetchOnMount;
