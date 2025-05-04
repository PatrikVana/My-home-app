// src/modules/admin/api/adminService.js
const API_URL = "http://localhost:5000/api/admin";
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

export const getPendingUsers = async () => {
  const res = await fetch(`${API_URL}/pending-registrations`, { headers: headers() });
  return await res.json();
};

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: headers() });
  return await res.json();
};

export const approveUser = async (id) => {
  await fetch(`${API_URL}/approve/${id}`, { method: "PUT", headers: headers() });
};

export const rejectUser = async (id) => {
  await fetch(`${API_URL}/reject/${id}`, { method: "DELETE", headers: headers() });
};

export const toggleUserStatus = async (id, status) => {
  await fetch(`${API_URL}/users/${id}/status`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ active: status }),
  });
};

export const updateUserRole = async (id, role) => {
  await fetch(`${API_URL}/users/${id}/role`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ role }),
  });
};

export const updateUserAccess = async (id, access) => {
  await fetch(`${API_URL}/users/${id}/access`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(access), 
  });
};

export const deleteUser = async (id) => {
  await fetch(`${API_URL}/users/${id}`, { method: "DELETE", headers: headers() });
};
