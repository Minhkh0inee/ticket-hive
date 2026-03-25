import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthState {
  user: null | {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: null | string;
  refreshToken: null | string;
  loading: boolean;
  error: null | string;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state, action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        user: any;
        accessToken: string;
        refreshToken: string;
      }>,
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    refreshTokenSuccess(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    refreshTokenFailed(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionExpired = true;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.sessionExpired = false;
    },
    clearSessionExpired(state) {
      state.sessionExpired = false;
    },
    registerRequest(
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }>,
    ) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state) {
      state.loading = false;
    },
    registerFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    fetchProfileRequest(state) {
      state.loading = true
    },
    fetchProfileSuccess(state, action: PayloadAction<any>) {
        state.loading = false
        state.user = action.payload
      },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailed,
  refreshTokenSuccess,
  refreshTokenFailed,
  logout,
  clearSessionExpired,
  registerRequest,
  registerSuccess,
  registerFailed,
  setTokens,
  fetchProfileRequest,
  fetchProfileSuccess
} = authSlice.actions;

export default authSlice.reducer;
