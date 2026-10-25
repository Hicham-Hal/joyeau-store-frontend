import { createAsyncThunk } from "@reduxjs/toolkit";

// Turns any Axios / Error object into a small serializable object that is
// safe to keep in the Redux state: { message, status }.
export function toApiError(error) {
  return {
    message: error?.response?.data?.message || error?.message || "unknown_error",
    status: error?.response?.status ?? null,
  };
}

// Error stored by a `rejected` reducer. `payload` is set by `rejectWithValue`;
// `action.error` covers anything thrown outside of our try/catch.
export function errorFrom(action) {
  return action.payload ?? { message: action.error?.message ?? "unknown_error", status: null };
}

// createAsyncThunk wrapper used by every slice: it calls a service function and
// always rejects with a serializable `{ message, status }` payload, so
// `dispatch(thunk()).unwrap()` throws something components can inspect.
export function apiThunk(type, request, options) {
  return createAsyncThunk(
    type,
    async (arg, { rejectWithValue }) => {
      try {
        return await request(arg);
      } catch (error) {
        return rejectWithValue(toApiError(error));
      }
    },
    options
  );
}
