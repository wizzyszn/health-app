/**
 * OAuth Configuration
 * Centralized configuration for OAuth providers
 */

export interface OAuthConfig {
  baseUrl: string;
  callbackPath: string;
  scopes?: string[];
  additionalParams?: Record<string, string>;
}

export interface OAuthProviderConfig {
  google: OAuthConfig;
  // Future providers can be added here
  // facebook: OAuthConfig;
  // microsoft: OAuthConfig;
}

/**
 * OAuth configuration based on environment
 */
const getOAuthConfig = (): OAuthProviderConfig => {
  const isDevelopment = import.meta.env.DEV;
  const backendBaseUrl = isDevelopment
    ? "http://localhost:3000" // Development backend URL
    : "https://health-app-backend-inzm.onrender.com"; // Production backend URL

  return {
    google: {
      baseUrl: `${backendBaseUrl}/auth/login-with-google`,
      callbackPath: "/auth/google",
      scopes: ["openid", "profile", "email"],
      additionalParams: {
        access_type: "online",
        response_type: "code",
        prompt: "select_account", // Always show account selection
      },
    },
  };
};

/**
 * Security configuration for OAuth
 */
export const OAUTH_SECURITY_CONFIG = {
  // Maximum age for state parameter (5 minutes)
  STATE_MAX_AGE: 5 * 60 * 1000,

  // Length of nonce for additional security
  NONCE_LENGTH: 16,

  // Session storage keys
  STORAGE_KEYS: {
    STATE: "google_oauth_state",
    NONCE: "google_oauth_nonce",
  },

  // Required JWT claims
  REQUIRED_JWT_CLAIMS: ["role", "user", "exp", "iat"],

  // Allowed user roles for patient portal
  ALLOWED_ROLES: ["patient"] as const,

  // Allowed providers
  ALLOWED_PROVIDERS: ["google"] as const,
} as const;

export const oauthConfig = getOAuthConfig();

/**
 * Validate OAuth configuration
 */
export const validateOAuthConfig = (): boolean => {
  try {
    const config = getOAuthConfig();

    // Check if all required URLs are valid
    Object.values(config).forEach((providerConfig) => {
      new URL(providerConfig.baseUrl); // Throws if invalid
    });

    return true;
  } catch (error) {
    console.error("Invalid OAuth configuration:", error);
    return false;
  }
};

export default oauthConfig;
