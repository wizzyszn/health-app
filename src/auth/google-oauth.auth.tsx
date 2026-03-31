import { AppDispatch } from "@/config/stores/store";
import { setRole, setToken, setUser } from "@/config/stores/slices/auth.slice";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useGoogleOAuth } from "@/shared/hooks/use-google-o-auth";

function GoogleOauth() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Use the OAuth validation hook
  const { validateOAuthState, cleanupOAuthState } = useGoogleOAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);

        // Check for OAuth errors first
        const error = queryParams.get("error");
        const errorDescription = queryParams.get("error_description");

        if (error) {
          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        // Validate state parameter for CSRF protection
        const state = queryParams.get("state");
        if (state && !validateOAuthState(state)) {
          throw new Error("Invalid or expired authentication state");
        }

        // Get and validate token
        const token = queryParams.get("token");

        if (!token) {
          throw new Error("No authentication token received from Google");
        }

        // Decode JWT token with basic validation
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let decoded: any;
        try {
          decoded = jwtDecode(token);
          console.log("Decoded JWT:", decoded); // Debug log to see the actual structure
        } catch {
          throw new Error("Invalid authentication token received");
        }

        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error("Authentication token has expired");
        }

        // Flexible validation - check for required fields based on actual token structure
        if (!decoded.role) {
          throw new Error("Invalid user role in authentication token");
        }

        // Extract role from token
        const userRole = decoded.role;

        // For Google OAuth in patient portal, accept "user" role or "patient" role
        if (userRole !== "patient" && userRole !== "user") {
          throw new Error(`Invalid user role for patient portal: ${userRole}`);
        }

        // Create user data object from JWT claims
        const userData = {
          _id: decoded.sub, // JWT standard 'sub' claim for user ID
          email: decoded.email,
          first_name:
            decoded.given_name || decoded.name?.split(" ")[0] || "User",
          last_name:
            decoded.family_name ||
            decoded.name?.split(" ").slice(1).join(" ") ||
            "",
          provider: "google",
          token: token, // Use the JWT token itself
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Validate essential user data exists
        if (!userData._id || !userData.email) {
          throw new Error(
            "Missing essential user data in authentication token",
          );
        }

        // Dispatch auth data to store - map "user" role to "patient" for the app
        const appRole = userRole === "user" ? "patient" : userRole;
        dispatch(setRole(appRole));
        dispatch(setToken(token));
        dispatch(setUser(userData));

        setAuthState("success");

        // Redirect after a brief success display
        setTimeout(() => {
          navigate("/patient/dashboard", { replace: true });
        }, 1500);
      } catch (error) {
        console.error("Google OAuth error:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
        setAuthState("error");

        // Clean up any stored state on error
        cleanupOAuthState();
      }
    };

    processOAuthCallback();
  }, [location.search, dispatch, navigate]);

  const handleRetry = () => {
    // Redirect back to login page to retry OAuth
    navigate("/patient/login", { replace: true });
  };

  if (authState === "success") {
    return (
      <div className="h-svh w-full flex justify-center items-center bg-gradient-to-br from-[#3784a6] to-[#1d4e5f]">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Success!</CardTitle>
            <CardDescription>
              You have been successfully signed in with Google.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Redirecting you to your dashboard...
            </p>
            <div className="flex justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-[#3784a6] border-t-transparent rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState === "error") {
    return (
      <div className="h-svh w-full flex justify-center items-center bg-gradient-to-br from-[#3784a6] to-[#1d4e5f]">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">
              Authentication Failed
            </CardTitle>
            <CardDescription>
              There was a problem signing you in with Google.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleRetry}
                className="w-full bg-[#3784a6] hover:bg-[#2d6a85]"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/patient/login", { replace: true })}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  return (
    <div className="h-svh w-full flex justify-center items-center bg-gradient-to-br from-[#3784a6] to-[#1d4e5f]">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Completing Sign In</CardTitle>
          <CardDescription>
            Please wait while we verify your Google account...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center"></CardContent>
      </Card>
    </div>
  );
}

export default GoogleOauth;
