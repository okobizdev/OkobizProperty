import { useState, useCallback } from "react";

interface UseAuthErrorHandlerOptions {
  onLoginSuccess?: () => void;
  customUnauthorizedMessage?: string;
}

export const useAuthErrorHandler = (
  options: UseAuthErrorHandlerOptions = {}
) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleApiError = useCallback(
    (error: any) => {
      if (error?.response?.status === 401) {
        setAuthError(
          options.customUnauthorizedMessage || "Please log in to continue."
        );
        setShowLoginModal(true);
        return true; // Indicates that this was an auth error
      }
      return false; // Not an auth error
    },
    [options.customUnauthorizedMessage]
  );

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setAuthError(null);
    if (options.onLoginSuccess) {
      options.onLoginSuccess();
    }
  }, [options]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return {
    showLoginModal,
    authError,
    handleApiError,
    closeLoginModal,
    clearAuthError,
  };
};

// Usage example:
// const { showLoginModal, authError, handleApiError, closeLoginModal } = useAuthErrorHandler({
//   customUnauthorizedMessage: "Please log in to book this property.",
//   onLoginSuccess: () => {
//     // Optionally retry the failed operation after login
//   }
// });
//
// // In your API call:
// try {
//   const response = await someApiCall();
// } catch (error) {
//   if (!handleApiError(error)) {
//     // Handle other types of errors
//     setError("Something went wrong");
//   }
// }
//
// // In your JSX:
// <LoginModal open={showLoginModal} onClose={closeLoginModal} />
