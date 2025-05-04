const API_URL = 'http://localhost:5000/api'; // URL backendu


// Získání úkolů (chráněná routa)
export const getNotes = async (group = "default") => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. User might not be logged in.");
  }

  try {
    // ✅ Ověříme, zda parametry nejsou prázdné
    const queryParams = new URLSearchParams();
    if (group && group !== "default") queryParams.append("group", group);
    
    const response = await fetch(`${API_URL}/notes?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};


// Přidání úkolu (chráněná routa)
// notesService.js
export const addNote = async (noteData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. User might not be logged in.");
  }

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData), // <--- Tady!
    });

    if (!response.ok) {
      throw new Error(`Failed to add note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};


// Smazání úkolu (chráněná routa)
export const deleteNote = async (id) => {
  if (!id) {
    throw new Error('Invalid task ID');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User might not be logged in.');
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Aktualizace úkolu (chráněná routa)
export const updateNote = async (id, updates) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User might not be logged in.');
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// ✅ Přidání funkce pro získání skupin úkolů
export const getNoteGroups = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User might not be logged in.');
  }

  try {
    const response = await fetch(`${API_URL}/noteGroups`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch note groups: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching note groups:', error);
    return [];
  }
};

// Smazání group (chráněná routa)
export const deleteNoteGroup = async (id) => {
  if (!id) {
    throw new Error('Invalid noteGroup name');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. User might not be logged in.');
  }

  try {
    const response = await fetch(`${API_URL}/noteGroups/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete noteGroup: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

