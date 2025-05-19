import { useState, useEffect, useCallback } from "react"; 
import {
    getNotes,
    addNote as addNoteAPI,
    deleteNote as deleteNoteAPI,
    updateNote as updateNoteAPI,
    getNoteGroups,
    deleteNoteGroup as deleteNoteGroupAPI
  } from "../../notes/api/notesService.js";

export function useNotes(selectedGroup, filterCompleted) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteGroups, setNoteGroups] = useState([]);

  // Použití useCallback, aby funkce neměnila referenci a nevyvolávala re-render
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const notesFromAPI = await getNotes(selectedGroup, filterCompleted);
      console.log("Poznámky načteny:", notesFromAPI);
      setNotes(notesFromAPI);
    } catch (error) {
      console.error("error při odchycení poznámek:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, filterCompleted]); // Závislosti zajistí, že se volá jen při změně hodnot

  const fetchNoteGroups = useCallback(async () => {
    try {
      const groups = await getNoteGroups();
      setNoteGroups(groups);
    } catch (error) {
      console.error("Error fetching note groups:", error);
    }
  }, []); // Fetch skupin poznámek se spustí jen jednou při prvním načtení

  const deleteNoteGroup = async (id) => {
    try {
      await deleteNoteGroupAPI(id);
      setNoteGroups((prevNoteGroups) => prevNoteGroups.filter((noteGroup) => noteGroup._id !== id));
    } catch (error) {
      console.error("chyba při odstranění skupiny:", error);
    }
  };

  const addNote = async (noteHeader, noteText, color, group, task) => {
    try {
      await addNoteAPI(noteHeader, noteText, color, group, task);
      await fetchNotes(); 
    } catch (error) {
      console.error("chyba při přidání poznámky:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteNoteAPI(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("chyba při odstranění poznámky:", error);
    }
  };

  const updateNote = async (noteId, updatedNote) => {
    try {
      const updatedNoteFromAPI = await updateNoteAPI(noteId, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, ...updatedNoteFromAPI } : note
        )
      );
    } catch (error) {
      console.error("chyba při aktualizaci poznámky:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    fetchNoteGroups();
  }, []);

  return {
    notes,
    noteGroups,
    loading,
    fetchNotes,
    fetchNoteGroups,
    deleteNoteGroup,
    addNote,
    deleteNote,
    updateNote,
  };
}
