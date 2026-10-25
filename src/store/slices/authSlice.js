import { createSlice } from "@reduxjs/toolkit";
import { apiThunk, errorFrom } from "../apiThunk";
import * as authService from "../../services/authService";

// Resolves with the logged-in user. The token itself lives in localStorage
// (read by the Axios request interceptor), not in the Redux state.
export const login = apiThunk("auth/login", async ({ username, password }) => {
  const session = await authService.login(username, password);
  authService.saveSession(session);
  return session.user;
});

// Plain thunk: clears the stored session, then the Redux user.
// Also dispatched by the Axios interceptor when the API answers 401.
export const logout = () => (dispatch) => {
  authService.clearSession();
  dispatch(sessionCleared());
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: authService.getCurrentUser(),
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    sessionCleared(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = errorFrom(action);
      });
  },
});

export const { sessionCleared } = authSlice.actions;
export default authSlice.reducer;
