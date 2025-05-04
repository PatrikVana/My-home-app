// src/store/tasks/tasksSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  getTaskGroups,
  createTaskGroup,
  deleteTaskGroup as deleteTaskGroupAPI,
} from "../../modules/tasks/api/tasksService"; // ✅ Importujeme z api.js

const initialState = {
  tasks: [],
  groups: [],
  loading: false,
  error: null,
};

// Načtení úkolů
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ group = "default", completed = false }, thunkAPI) => {
    try {
      const data = await getTodos(group, completed);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Přidání úkolu
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async ({ text, priority, group }, thunkAPI) => {
    try {
      const newTask = await addTodo(text, priority, group);
      return newTask;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Smazání úkolu
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      await deleteTodo(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Úprava úkolu
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }, thunkAPI) => {
    try {
      const updated = await updateTodo(id, updates);
      return updated;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Načtení skupin úkolů
export const fetchTaskGroups = createAsyncThunk(
  "tasks/fetchTaskGroups",
  async (_, thunkAPI) => {
    try {
      const groups = await getTaskGroups();
      return groups;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { groups } = getState().tasks;
      return groups.length === 0; // ✅ pokud už jsou skupiny, nenačítej znovu
    },
  }
);


export const addTaskGroup = createAsyncThunk(
  "tasks/addTaskGroup",
  async (name, thunkAPI) => {
    try {
      return await createTaskGroup(name); // ✅ volání nové funkce
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTaskGroup = createAsyncThunk(
  "tasks/deleteTaskGroup",
  async (id, thunkAPI) => {
    try {
      const result = await deleteTaskGroupAPI(id); // přejmenuj si to podle potřeby
      return result.id; // <<< jen ID potřebujeme
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // deleteTask
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })

      // updateTask
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(fetchTaskGroups.fulfilled, (state, action) => {
        state.groups = action.payload; // ⬅️ změna
      })

      .addCase(addTaskGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload); // ⬅️ změna
      })

      .addCase(deleteTaskGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((group) => group._id !== action.payload);
      })
  },
});

export default tasksSlice.reducer;
