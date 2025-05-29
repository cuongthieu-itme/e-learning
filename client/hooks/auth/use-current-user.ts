import { useAuthStore } from '@/store/auth.store';
import { useEffect, useState } from 'react';

export const useCurrentUser = () => {
  const { user, isLoading, error, fetchUser, isAuthenticated } = useAuthStore();
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
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
    refetch: fetchUser,
  };
};
