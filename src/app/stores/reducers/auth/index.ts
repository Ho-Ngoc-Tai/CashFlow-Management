import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { LOADING_STATUS } from "@interfaces/base";
import { AuthState, UserProfile } from "@interfaces/cashflow";

const initialState: AuthState = {
  user: {
    id: "usr_001",
    email: "minh.anh@flowsync.enterprise",
    fullName: "Trần Minh Anh",
    role: "CFO",
    companyName: "FlowSync Enterprise VN",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhaDJyMO0A9nau9f62JLydrBkwmXZUsjer3CTU4F_CTGFASc2VLGrO77tmhqFY3n1RyCZm5ySe7dz8-Qtqyal7qc1KEF9ISq1petCrI_QPDRo72KUF1ZgYocXEzNe7z1hT1jALrDAS0k6eWnW4eYo5jEvAjFK4S675SxSzOiFfbKTaTThTA8LGhDXXqJrT6nXWGE-yWFvQ7cbmzXk3wKfYv4RZYxDc8WrGl4ZJdNKTx4qBf9DGNDt",
  },
  isAuthenticated: true,
  status: LOADING_STATUS.IDLE,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.status = LOADING_STATUS.LOADING;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: UserProfile }>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    getUserInfoAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    getUserInfoSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserInfoFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
    },
    logoutAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    logoutSuccess: (state) => {
      state.status = LOADING_STATUS.IDLE;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  loginAction,
  loginSuccess,
  loginFailure,
  getUserInfoAction,
  getUserInfoSuccess,
  getUserInfoFailure,
  logoutAction,
  logoutSuccess,
} = authSlice.actions;

export const authSelector = createSelector(
  (state: { auth: AuthState }) => state.auth,
  (auth) => auth
);
