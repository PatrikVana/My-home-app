import { useState, useEffect } from "react";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // ✅ Přednastavení podle tokenu
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false); // ✅ Zajistí správný stav při odhlášení
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Chyba při načítání uživatele");
      }

      const userData = await response.json();
      localStorage.setItem("user", JSON.stringify(userData));

      setUserRole(userData.role);
      setUserPermissions(userData.permissions || {});
      setIsLoggedIn(true); // ✅ Zabrání smyčce
    } catch (error) {
      console.error("Chyba při načítání uživatele:", error);
      setIsLoggedIn(false); // ✅ Oprava stavu při chybě
    }
  };

  const handleLogin = async () => {
    await fetchUserData();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    setUserPermissions(null);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]); // ✅ Opravená závislost, už se nebude spouštět zbytečně

  return { isLoggedIn, userRole, userPermissions, handleLogin, handleLogout };
}
