const API_URL = 'http://localhost:5000/api'; // URL backendu

// Funkce pro registraci uživatele
export const registerUser = async (username, email, password, gender) => {
  try {
    console.log('Posílání requestu registrace', {username, email, password, gender });

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, gender }),
    });

    if (!response.ok) {
      throw new Error(`Nepovedlo se provést registraci: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Funkce pro přihlášení uživatele
export const loginUser = async (username, password) => {
  try {
    console.log('🔹 posílání requestu přihlášení:', { username, password });

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Nepovedlo se přihlásit: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.token) {
      console.log("Ukládání tokenu do localStorage...");
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
    }

    return data;
  } catch (error) {
    throw error;
  }
};
