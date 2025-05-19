// src/modules/admin/api/adminService.js
const API_URL = "http://localhost:5000/api/admin";
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

// načtení všech uživatelů, čekajících na schválení účtu
export const getPendingUsers = async () => {
  const res = await fetch(`${API_URL}/pending-registrations`, { headers: headers() });
  return await res.json();
};

// načtení všech existujících uživatelů
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: headers() });
  return await res.json();
};

// schválení uživatele, který čeká na schválení
export const approveUser = async (id) => {
  await fetch(`${API_URL}/approve/${id}`, { method: "PUT", headers: headers() });
};

//zamítnutí uživatele, který čeká na schválení
export const rejectUser = async (id) => {
  await fetch(`${API_URL}/reject/${id}`, { method: "DELETE", headers: headers() });
};

// blokování/aktivace účtu uživatele
export const toggleUserStatus = async (id, status) => {
  await fetch(`${API_URL}/users/${id}/status`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ active: status }),
  });
};

//změna role uživatele
export const updateUserRole = async (id, role) => {
  await fetch(`${API_URL}/users/${id}/role`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ role }),
  });
};

// aktualizace přístupů k modulům pro uživatele
export const updateUserAccess = async (id, access) => {
  await fetch(`${API_URL}/users/${id}/access`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(access), 
  });
};

// odstranění uživatele 
export const deleteUser = async (id) => {
  await fetch(`${API_URL}/users/${id}`, { method: "DELETE", headers: headers() });
};
