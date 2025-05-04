const API_URL = 'http://localhost:5000/api'; // URL backendu



// Získání úkolů (chráněná routa)
export const getTodos = async (group = "default", completed = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("No token found. User might not be logged in.");
    }

    try {
        // ✅ Ověříme, zda parametry nejsou prázdné
        const queryParams = new URLSearchParams();
        if (group && group !== "default") queryParams.append("group", group);
        queryParams.append("completed", completed.toString()); // ✅ Opraveno

        const response = await fetch(`${API_URL}/todo?${queryParams.toString()}`, {
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
        console.error("Error fetching todos:", error);
        throw error;
    }
};


// Přidání úkolu (chráněná routa)
export const addTodo = async (text, priority, group = "default") => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User might not be logged in.');
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
            throw new Error(`Failed to add todo: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding todo:', error);
        throw error;
    }
};

// Smazání úkolu (chráněná routa)
export const deleteTodo = async (id) => {
    if (!id) {
        throw new Error('Invalid task ID');
    }

    console.log('Deleting task with ID:', id);

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User might not be logged in.');
    }

    try {
        const response = await fetch(`${API_URL}/todo/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete todo: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

// Aktualizace úkolu (chráněná routa)
export const updateTodo = async (id, updates) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User might not be logged in.');
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
            throw new Error(`Failed to update todo: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

// ✅ Přidání funkce pro získání skupin úkolů
export const getTaskGroups = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User might not be logged in.');
    }

    try {
        const response = await fetch(`${API_URL}/taskGroups`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch task groups: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching task groups:', error);
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
  

// ❌ Smazání skupiny úkolů
export const deleteTaskGroup = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found. User might not be logged in.');
    }

    try {
        const response = await fetch(`${API_URL}/taskGroups/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete task group: ${response.statusText}`);
        }

        return await response.json(); // nebo `return id;` pokud backend nic nevrací
    } catch (error) {
        console.error('Error deleting task group:', error);
        throw error;
    }
};

