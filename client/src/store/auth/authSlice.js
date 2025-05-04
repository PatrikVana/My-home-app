// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../modules/auth/api/authService';

// nastavení prvotního stavu (načtení tokenu, role, permissions, isAutenticated hodnot z localStorage)
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  permissions: JSON.parse(localStorage.getItem('permissions')) || {},
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// redux async funkce pro přihlášení uživatele, spouští funkci loginUser z authService souboru
export const loginUser = createAsyncThunk('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    const data = await authService.loginUser(username, password);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// redux async funkce pro registrace, spouští funkci registerUser z authService souboru
export const registerUser = createAsyncThunk('auth/register', async ({ username, email, password, gender }, thunkAPI) => {
  try {
    const data = await authService.registerUser(username, email, password, gender);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// redux async funkce pro načtení uživatele z tokenu přes /auth/me
export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
    try {
      // načtení tokenu
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      // načtení odpovědi pomocí tokenu
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Chyba při načítání uživatele');
      }
      // kompilace odpovědi do formátu JSON
      const userData = await response.json();
  
      // Uložení znovu do localStorage
      localStorage.setItem('role', userData.role);
      localStorage.setItem('permissions', JSON.stringify(userData.permissions));
  
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  });
  

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.permissions = {};
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.user = action.payload.username;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // loadUser
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.isAuthenticated = true;
        state.loading = false;
      })
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
