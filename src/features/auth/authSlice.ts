
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('tms-user') || 'null'),
  token: localStorage.getItem('tms-token'),
  isAuthenticated: !!localStorage.getItem('tms-token'),
  theme: (localStorage.getItem('tms-theme') as 'light' | 'dark') || 'light',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('tms-user', JSON.stringify(action.payload.user));
      localStorage.setItem('tms-token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tms-user');
      localStorage.removeItem('tms-token');
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('tms-theme', state.theme);
    },
  },
});

export const { loginSuccess, logout, toggleTheme } = authSlice.actions;
