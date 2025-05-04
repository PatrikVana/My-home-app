const API_URL = 'http://localhost:5000/api'; // URL backendu

// Funkce pro registraci uživatele
export const registerUser = async (username, email, password, gender) => {
  try {
    console.log('Sending register request:', {username, email, password, gender });

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, gender }),
    });

    if (!response.ok) {
      throw new Error(`Failed to register: ${response.statusText}`);
    }

    console.log('Register response received:', response);
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

// Funkce pro přihlášení uživatele
export const loginUser = async (username, password) => {
  try {
    console.log('🔹 Sending login request:', { username, password });

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Login response received:', data);

    if (data.token) {
      console.log("💾 Ukládám token do localStorage...");
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
    }

    return data;
  } catch (error) {
    console.error('❌ Error during login:', error);
    throw error;
  }
};
