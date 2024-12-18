import { useState, useEffect } from 'react';

function useErrorBoundary() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      console.error("Uncaught error:", event.error, event.message);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  return hasError;
}

export default useErrorBoundary;
