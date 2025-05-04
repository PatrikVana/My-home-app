// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notes/notesSlice';
import tasksReducer from './tasks/tasksSlice';
import adminReducer from './admin/adminSlice';
import notificationsReducer from './notifications/notificationsSlice';
import authReducer from './auth/authSlice';
// import authReducer from './auth/authSlice'; // připraveno do budoucna

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    tasks: tasksReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
    auth: authReducer,
  },
});