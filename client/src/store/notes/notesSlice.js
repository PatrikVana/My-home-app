import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notesService from "../../modules/notes/api/notesService";

// 1️⃣ Počáteční stav
const initialState = {
    notes: [],
    groups: [],
    loading: false,
    error: null,
};

// 2️⃣ Thunky (asynchronní akce)

// Načtení poznámek
export const fetchNotes = createAsyncThunk(
    "notes/fetchNotes",
    async (group = "default", thunkAPI) => {
        try {
            const notes = await notesService.getNotes(group);
            return notes;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// Přidání poznámky
export const addNote = createAsyncThunk(
    "notes/addNote",
    async (noteData, thunkAPI) => {
      try {
        const newNote = await notesService.addNote(noteData); // ← tady předáváme přímo celý objekt
        return newNote;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

// Smazání poznámky
export const deleteNote = createAsyncThunk(
    "notes/deleteNote",
    async (noteId, thunkAPI) => {
        try {
            await notesService.deleteNote(noteId);
            return noteId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Úprava poznámky
export const updateNote = createAsyncThunk(
    "notes/updateNote",
    async ({ id, updates }, thunkAPI) => {
        try {
            const updated = await notesService.updateNote(id, updates);
            return updated;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Načtení skupin poznámek
export const fetchNoteGroups = createAsyncThunk("notes/fetchNoteGroups", async (_, thunkAPI) => {
    try {
        const groups = await notesService.getNoteGroups();
        return groups;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// ✅ Přidání skupiny poznámek
export const addNoteGroup = createAsyncThunk(
    "notes/addNoteGroup",
    async (name, thunkAPI) => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/noteGroups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        });
  
        if (!res.ok) {
          const errData = await res.json();
          console.error("🔴 Backend odpověď (chyba):", errData);
          throw new Error("Chyba při přidávání skupiny: " + errData?.message);
        }
  
        const json = await res.json();
        console.log("✅ Přidána skupina:", json);
        return json;
      } catch (error) {
        console.error("❌ Chyba při POST /noteGroups:", error.message);
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

// smazání skupiny
export const deleteNoteGroup = createAsyncThunk(
    "notes/deleteNoteGroup",
    async (groupId, thunkAPI) => {
        try {
            await notesService.deleteNoteGroup(groupId); // název funkce v notesService
            return groupId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// 3️⃣ Slice
const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {}, // Pokud bys chtěl přidat sync akce
    extraReducers: (builder) => {
        builder
            // fetchNotes
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // addNote
            .addCase(addNote.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })

            // deleteNote
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter(note => note._id !== action.payload);
            })

            // updateNote
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.notes.findIndex(note => note._id === action.payload._id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })

            //fetchNoteGroups
            .addCase(fetchNoteGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
            })

            // addNoteGroup
            .addCase(addNoteGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload);
            })

            //deleteNoteGroup
            .addCase(deleteNoteGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(group => group._id !== action.payload);
            })

    },
});

// 4️⃣ Export reduceru (pro `store/index.js`)
export default notesSlice.reducer;
