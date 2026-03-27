import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/apiClient';

// ── Thunks ────────────────────────────────────────────────────────
export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.title || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.title || 'Login failed');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    JSON.parse(localStorage.getItem('user') || 'null'),
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, action) => {
      state.loading = false;
      state.token   = action.payload.token;
      state.user    = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    };

    builder
      .addCase(register.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(register.fulfilled, handleAuth)
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(login.pending,  (state) => { state.loading = true;  state.error = null; })
      .addCase(login.fulfilled, handleAuth)
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectUser   = (state) => state.auth.user;
export const selectToken  = (state) => state.auth.token;
export const selectIsAuth = (state) => !!state.auth.token;
