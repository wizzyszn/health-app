/**
 * Environment configuration validator for OAuth setup
 */

interface EnvironmentCheck {
  name: string;
  required: boolean;
  value: string | undefined;
  valid: boolean;
  message: string;
}

/**
 * Validates the OAuth environment configuration
 */
export const validateOAuthEnvironment = (): EnvironmentCheck[] => {
  const checks: EnvironmentCheck[] = [
    {
      name: "Backend URL",
      required: true,
      value: import.meta.env.VITE_BACKEND_URL,
      valid: false,
      message: "",
    },
    {
      name: "Environment Mode",
      required: true,
      value: import.meta.env.MODE,
      valid: false,
      message: "",
    },
    {
      name: "Development Mode",
      required: false,
      value: import.meta.env.DEV ? "true" : "false",
      valid: true,
      message: "Development mode detected",
    },
  ];

  // Validate backend URL
  const backendCheck = checks.find((c) => c.name === "Backend URL");
  if (backendCheck) {
    if (backendCheck.value) {
      try {
        new URL(backendCheck.value);
        backendCheck.valid = true;
        backendCheck.message = "Valid backend URL configured";
      } catch {
        backendCheck.valid = false;
        backendCheck.message = "Invalid backend URL format";
      }
    } else {
      // Use default URLs based on environment
      backendCheck.valid = true;
      backendCheck.value = import.meta.env.DEV
        ? "http://localhost:3000 (default)"
        : "https://health-app-backend-inzm.onrender.com (default)";
      backendCheck.message = "Using default backend URL";
    }
  }

  // Validate environment mode
  const envCheck = checks.find((c) => c.name === "Environment Mode");
  if (envCheck) {
    const validModes = ["development", "production", "test"];
    envCheck.valid = envCheck.value
      ? validModes.includes(envCheck.value)
      : false;
    envCheck.message = envCheck.valid
      ? `Running in ${envCheck.value} mode`
      : "Invalid or missing environment mode";
  }

  return checks;
};

/**
 * Logs OAuth environment status to console
 */
export const logOAuthEnvironmentStatus = (): void => {
  const checks = validateOAuthEnvironment();

  console.group("🔐 OAuth Environment Configuration");

  checks.forEach((check) => {
    const icon = check.valid ? "✅" : "❌";
    const level = check.valid ? "log" : check.required ? "error" : "warn";

    console[level](`${icon} ${check.name}: ${check.value || "Not set"}`);
    if (check.message) {
      console[level](`   → ${check.message}`);
    }
  });

  const hasErrors = checks.some((c) => c.required && !c.valid);
  if (hasErrors) {
    console.error(
      "⚠️  OAuth configuration has errors that may prevent proper authentication",
    );
  } else {
    console.log("✨ OAuth configuration looks good!");
  }

  console.groupEnd();
};

/**
 * Check if OAuth environment is ready for production
 */
export const isOAuthProductionReady = (): boolean => {
  const checks = validateOAuthEnvironment();
  return checks.filter((c) => c.required).every((c) => c.valid);
};

// Auto-run environment check in development
if (import.meta.env.DEV) {
  setTimeout(() => logOAuthEnvironmentStatus(), 1000);
}
