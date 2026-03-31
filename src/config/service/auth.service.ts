import { GeneralReturnInt, Patient, UserRole } from "@/lib/types";
import { options, requestHandler, urlGenerator } from "./config";
// Register Admin with Credentials
export const signupAdminWithCredReq = (data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) => {
  const url = urlGenerator("auth", "admin/signup", false);
  return requestHandler<GeneralReturnInt<Patient>>(url, options("POST", data));
};
// Login Admin With Credentials
export const signInAdminWithCredReq = (data: {
  email: string;
  password: string;
}) => {
  const url = urlGenerator("auth", "admin/login", false);
  return requestHandler<GeneralReturnInt<Patient>>(url, options("POST", data));
};

// Access App with Google Auth
export const continueWithGoogle = () => {
  const url = urlGenerator("auth", "login-with-google", false);
  return requestHandler<GeneralReturnInt<Patient>>(
    url,
    options("GET", null, false),
  );
};

// token refresh

export const refreshTokenReq = (data: {
  refreshToken: string;
  role: UserRole;
}) => {
  const url = urlGenerator("auth", "refresh", false);

  return requestHandler<
    GeneralReturnInt<{
      accessToken: string;
      refreshToken: string;
    }>
  >(url, options("POST", data, true));
};

//change-password

export const changePasswordReq = (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const url = urlGenerator("auth", "change-password", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, true),
  );
};
