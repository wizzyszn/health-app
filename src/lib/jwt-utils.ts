import { jwtDecode, JwtPayload } from "jwt-decode";
import { OAUTH_SECURITY_CONFIG } from "./oauth-config";
import { Patient, UserRole } from "./types";

export interface ValidatedJWTPayload extends JwtPayload {
  role: UserRole;
  user: {
    _id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email: string;
    active?: boolean;
    provider: "local" | "google" | "facebook";
    createdAt: string;
    updatedAt: string;
    token: string;
    phone_number?: string;
  };
}

export class JWTValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JWTValidationError";
  }
}

/**
 * Validates and decodes a JWT token with comprehensive security checks
 */
export const validateAndDecodeJWT = (token: string): ValidatedJWTPayload => {
  if (!token || typeof token !== "string") {
    throw new JWTValidationError("No authentication token provided");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decoded: any;

  try {
    decoded = jwtDecode<Patient & JwtPayload>(token);
  } catch {
    throw new JWTValidationError("Invalid authentication token format");
  }

  // Check token expiration
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < currentTime) {
    throw new JWTValidationError("Authentication token has expired");
  }

  // Check if token was issued in the future (clock skew protection)
  if (decoded.iat && decoded.iat > currentTime + 60) {
    // Allow 60 seconds skew
    throw new JWTValidationError("Authentication token issued in the future");
  }

  // Validate required claims exist
  const missingClaims = OAUTH_SECURITY_CONFIG.REQUIRED_JWT_CLAIMS.filter(
    (claim) => !decoded[claim],
  );

  if (missingClaims.length > 0) {
    throw new JWTValidationError(
      `Missing required claims: ${missingClaims.join(", ")}`,
    );
  }

  // Validate user role
  if (!OAUTH_SECURITY_CONFIG.ALLOWED_ROLES.includes(decoded.role)) {
    throw new JWTValidationError(`Invalid user role: ${decoded.role}`);
  }

  // Validate user object structure
  if (!decoded.user || typeof decoded.user !== "object") {
    throw new JWTValidationError("Invalid user data in token");
  }

  // Validate required user fields
  const requiredUserFields = [
    "_id",
    "email",
    "first_name",
    "last_name",
    "provider",
    "token",
  ];
  const missingUserFields = requiredUserFields.filter(
    (field) => !decoded.user[field],
  );

  if (missingUserFields.length > 0) {
    throw new JWTValidationError(
      `Missing required user fields: ${missingUserFields.join(", ")}`,
    );
  }

  // Validate provider
  if (
    !OAUTH_SECURITY_CONFIG.ALLOWED_PROVIDERS.includes(decoded.user.provider)
  ) {
    throw new JWTValidationError(
      `Invalid authentication provider: ${decoded.user.provider}`,
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(decoded.user.email)) {
    throw new JWTValidationError("Invalid email format in user data");
  }

  // Additional security: Check if user is active (if field exists)
  if (decoded.user.active === false) {
    throw new JWTValidationError("User account is not active");
  }

  return decoded as ValidatedJWTPayload;
};

/**
 * Extract user information safely from a validated JWT
 */
export const extractUserFromJWT = (validatedPayload: ValidatedJWTPayload) => {
  return {
    id: validatedPayload.user._id,
    email: validatedPayload.user.email,
    firstName: validatedPayload.user.first_name,
    lastName: validatedPayload.user.last_name,
    middleName: validatedPayload.user.middle_name,
    role: validatedPayload.role,
    provider: validatedPayload.user.provider,
    token: validatedPayload.user.token,
    phoneNumber: validatedPayload.user.phone_number,
    isActive: validatedPayload.user.active !== false,
    createdAt: validatedPayload.user.createdAt,
    updatedAt: validatedPayload.user.updatedAt,
  };
};

/**
 * Check if a JWT token is about to expire (within next 5 minutes)
 */
export const isTokenNearExpiry = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;

    // Return true if token expires within 5 minutes
    return timeUntilExpiry < 300;
  } catch {
    return true; // Treat invalid tokens as expired
  }
};

/**
 * Get remaining time until token expiration in seconds
 */
export const getTokenExpiryTime = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return null;

    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, decoded.exp - currentTime);
  } catch {
    return null;
  }
};
