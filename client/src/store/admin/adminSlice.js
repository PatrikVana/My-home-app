// src/store/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminService from "../../modules/admin/api/adminService";

const initialState = {
  users: [],
  pendingUsers: [],
  loading: false,
  error: null,
};

// Thunky
export const fetchPendingUsers = createAsyncThunk("admin/fetchPendingUsers", async (_, thunkAPI) => {
  try {
    return await adminService.getPendingUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers", async (_, thunkAPI) => {
  try {
    return await adminService.getUsers();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const approveUser = createAsyncThunk("admin/approveUser", async (id, thunkAPI) => {
  try {
    await adminService.approveUser(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const rejectUser = createAsyncThunk("admin/rejectUser", async (id, thunkAPI) => {
  try {
    await adminService.rejectUser(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUserStatus = createAsyncThunk("admin/toggleUserStatus", async ({ id, status }, thunkAPI) => {
  try {
    await adminService.toggleUserStatus(id, status);
    return { id, status };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUserRole = createAsyncThunk("admin/updateUserRole", async ({ id, role }, thunkAPI) => {
  try {
    await adminService.updateUserRole(id, role);
    return { id, role };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateUserAccess = createAsyncThunk("admin/updateUserAccess", async ({ id, access }, thunkAPI) => {
  try {
    await adminService.updateUserAccess(id, access);
    return { id, access };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, thunkAPI) => {
  try {
    await adminService.deleteUser(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.pendingUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchPendingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;