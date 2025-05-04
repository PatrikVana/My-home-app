// src/store/notifications/notificationsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (message, type = "info") => {
        return {
          payload: {
            id: nanoid(),
            message,
            type,
          },
        };
      },
    },
    removeNotification: (state, action) => {
      return state.filter((notif) => notif.id !== action.payload);
    },
    clearNotification: () => {
      return [];
    },
  },
});

export const { addNotification, removeNotification, clearNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
