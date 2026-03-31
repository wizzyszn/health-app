import { Storages } from "@/lib/helpers";
import { StorageKeysEnum, UserRole, UserType } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface AuthState<T> {
  user: T | null;
  token: string | null;
  refreshToken: string | null;
  role: UserRole;
}

const initialState: AuthState<UserType> = {
  user: Storages.getStorage("local", StorageKeysEnum.user) as UserType | null,
  token: null, // Keep in memory only
  refreshToken: Storages.getStorage("local", StorageKeysEnum.refresh_token),
  role: Storages.getStorage("local", StorageKeysEnum.role) as UserRole,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      Storages.clearStorage("session");
      Storages.clearStorage("local");
    },
    setUser<T>(state: AuthState<T>, action: PayloadAction<T>) {
      state.user = action.payload;
      Storages.setStorage("local", StorageKeysEnum.user, state.user);
    },
    setToken<T>(state: AuthState<T>, action: PayloadAction<string>) {
      state.token = action.payload; // In memory only, do not persist to local storage
    },
    setRefreshToken<T>(state: AuthState<T>, action: PayloadAction<string>) {
      state.refreshToken = action.payload;
      Storages.setStorage(
        "local",
        StorageKeysEnum.refresh_token,
        state.refreshToken,
      );
    },
    setRole<T>(state: AuthState<T>, action: PayloadAction<UserRole>) {
      state.role = action.payload;
      Storages.setStorage("local", StorageKeysEnum.role, action.payload);
    },
  },
  extraReducers: () => {},
});
export const { setUser, setToken, logout, setRole, setRefreshToken } =
  authSlice.actions;
export default authSlice.reducer;
