import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

/**
 * Custom hook to fetch and provide the current logged-in user
 * @returns An object containing user data, loading state, and error information
 */
export const useCurrentUser = () => {
  const { user, isLoading, error, fetchUser, isAuthenticated } = useAuthStore();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    // Only fetch the user once
    if (!hasAttemptedFetch) {
      fetchUser();
      setHasAttemptedFetch(true);
    }
  }, [fetchUser, hasAttemptedFetch]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    refetch: fetchUser, // Expose refetch function for manual refreshes
  };
};
