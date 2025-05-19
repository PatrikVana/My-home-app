const API_URL = 'http://localhost:5000/api'; 


// Získání všech poznámek
export const getNotes = async (group = "default") => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("token nenalezen, uživatel možná není přihlášen");
  }

  try {
    // ověření jestli nejsou parametry prázdné
    const queryParams = new URLSearchParams();
    if (group && group !== "default") queryParams.append("group", group);
    
    const response = await fetch(`${API_URL}/notes?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`chyba při načítání poznámek: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    
    throw error;
  }
};


// Přidání poznámky
export const addNote = async (noteData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("token nenalezen, uživatel možná není přihlášen");
  }

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      throw new Error(`nepodařilo se uložit poznámku: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


// Smazání poznámky
export const deleteNote = async (id) => {
  if (!id) {
    throw new Error('nesprávné id poznámky');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('token nenalezen, uživatel možná není přihlášen');
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Nepodařilo se odstranit poznámku: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Aktualizace poznámky
export const updateNote = async (id, updates) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('token nenalezen, uživatel možná není přihlášen');
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
      throw new Error(`nepodařilo se aktualizovat poznámku: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// získání skupin poznámek
export const getNoteGroups = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('token nenalezen, uživatel možná není přihlášen');
  }

  try {
    const response = await fetch(`${API_URL}/noteGroups`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`nepodařilo se získat skupiny poznámek: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    return [];
  }
};

// Smazání skupiny poznámek
export const deleteNoteGroup = async (id) => {
  if (!id) {
    throw new Error('nesprávná skupina');
  }

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('token nenalezen, uživatel možná není přihlášen');
  }

  try {
    const response = await fetch(`${API_URL}/noteGroups/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`nepodařilo se odstranit skupinu poznámek: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

