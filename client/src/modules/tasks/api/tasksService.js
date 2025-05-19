const API_URL = 'http://localhost:5000/api'; 



// Získání všech úkolů
export const getTodos = async (group = "default", completed = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token nenalezen, uživatel asi není přihlášen");
    }

    try {
        // Ověření zda parametry nejsou prázdné
        const queryParams = new URLSearchParams();
        if (group && group !== "default") queryParams.append("group", group);
        queryParams.append("completed", completed.toString());

        const response = await fetch(`${API_URL}/todo?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`chyba při odchycení úkolu: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};


// Přidání nového úkolu 
export const addTodo = async (text, priority, group = "default") => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token nenalezen, uživatel asi není přihlášen');
    }

    try {
        const response = await fetch(`${API_URL}/todo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text, priority, group }),
        });

        if (!response.ok) {
            throw new Error(`nepodařilo se přidat úkol: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Smazání úkolu
export const deleteTodo = async (id) => {
    if (!id) {
        throw new Error('nesprávné id úkolu');
    }

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token nenalezen, uživatel asi není přihlášen');
    }

    try {
        const response = await fetch(`${API_URL}/todo/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`chyba při mazání úkolu: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Aktualizace úkolu
export const updateTodo = async (id, updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token nenalezen, uživatel asi není přihlášen');
    }

    try {
        const response = await fetch(`${API_URL}/todo/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error(`chyba při aktualizaci úkolu: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

// získání všech skupin úkolů
export const getTaskGroups = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token nenalezen, uživatel asi není přihlášen');
    }

    try {
        const response = await fetch(`${API_URL}/taskGroups`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`chyba při odchycení skupin úkolůs: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        return [];
    }
};

// Přidání nové skupiny úkolů
export const createTaskGroup = async (name) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Chybí token");
  
    const res = await fetch(`${API_URL}/taskGroups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  
    if (!res.ok) throw new Error("Chyba při přidávání skupiny");
    return await res.json();
  };
  

// Smazání skupiny úkolů
export const deleteTaskGroup = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token nenalezen, uživatel asi není přihlášen');
    }

    try {
        const response = await fetch(`${API_URL}/taskGroups/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`chyba při odstranění skupiny úkolů: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

