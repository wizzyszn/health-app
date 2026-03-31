import { useState, useCallback } from "react";
import { oauthConfig, OAUTH_SECURITY_CONFIG } from "@/lib/oauth-config";

interface OAuthState {
  timestamp: number;
  origin: string;
  nonce: string;
}

interface UseGoogleOAuthOptions {
  onError?: (error: string) => void;
}

/**
 * Custom hook for handling Google OAuth securely
 * Includes CSRF protection and proper error handling
 */
export const useGoogleOAuth = (options: UseGoogleOAuthOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { onError } = options;

  /**
   * Generate a cryptographically secure random string
   */
  const generateNonce = (): string => {
    const array = new Uint8Array(OAUTH_SECURITY_CONFIG.NONCE_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  };

  /**
   * Initiate Google OAuth flow
   */
  const initiateGoogleAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      // Generate secure state parameter
      const state: OAuthState = {
        timestamp: Date.now(),
        origin: window.location.origin,
        nonce: generateNonce(),
      };

      const encodedState = btoa(JSON.stringify(state));

      // Store state securely for validation
      sessionStorage.setItem(
        OAUTH_SECURITY_CONFIG.STORAGE_KEYS.STATE,
        encodedState,
      );

      // Construct OAuth URL using configuration
      const authUrl = new URL(oauthConfig.google.baseUrl);
      authUrl.searchParams.set("state", encodedState);

      // Add configured additional parameters
      Object.entries(oauthConfig.google.additionalParams || {}).forEach(
        ([key, value]) => {
          authUrl.searchParams.set(key, value);
        },
      );

      // Redirect to OAuth provider
      window.location.href = authUrl.toString();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google OAuth";
      console.error("Google OAuth initiation error:", error);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  }, [onError]);

  /**
   * Validate OAuth state parameter
   */
  const validateOAuthState = useCallback((receivedState: string): boolean => {
    try {
      const storedState = sessionStorage.getItem(
        OAUTH_SECURITY_CONFIG.STORAGE_KEYS.STATE,
      );

      if (!storedState || !receivedState) {
        return false;
      }

      const decodedReceivedState: OAuthState = JSON.parse(atob(receivedState));
      const decodedStoredState: OAuthState = JSON.parse(atob(storedState));

      // Validate all state components match
      const isValidState =
        decodedReceivedState.timestamp === decodedStoredState.timestamp &&
        decodedReceivedState.origin === decodedStoredState.origin &&
        decodedReceivedState.nonce === decodedStoredState.nonce;

      // Check if state is not too old
      const isNotExpired =
        Date.now() - decodedReceivedState.timestamp <
        OAUTH_SECURITY_CONFIG.STATE_MAX_AGE;

      // Clean up stored state
      sessionStorage.removeItem(OAUTH_SECURITY_CONFIG.STORAGE_KEYS.STATE);

      return isValidState && isNotExpired;
    } catch (error) {
      console.error("Error validating OAuth state:", error);
      sessionStorage.removeItem(OAUTH_SECURITY_CONFIG.STORAGE_KEYS.STATE);
      return false;
    }
  }, []);

  /**
   * Clean up OAuth state (call on component unmount or error)
   */
  const cleanupOAuthState = useCallback(() => {
    sessionStorage.removeItem(OAUTH_SECURITY_CONFIG.STORAGE_KEYS.STATE);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    initiateGoogleAuth,
    validateOAuthState,
    cleanupOAuthState,
  };
};

export default useGoogleOAuth;
