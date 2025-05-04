import { BrowserRouter as Router } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, loadUser } from "./store/auth/authSlice";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import NotificationDisplay from "./components/NotificationDisplay";

import Sidebar from "./layout/Sidebar";
import AnimatedRoutes from "./AnimatedRoutes";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";

function App() {

  const dispatch = useDispatch();

const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
const userRole = useSelector((state) => state.auth.role);
const userPermissions = useSelector((state) => state.auth.permissions);

// ✅ Načíst uživatele po načtení aplikace (pokud je token v localStorage)
useEffect(() => {
  dispatch(loadUser());
}, [dispatch]);

const handleLogout = () => {
  dispatch(logoutUser());
};

  return (
    <Router>
      <div className="app-background"></div>

      <div className="app d-flex">
        {isLoggedIn && (
          <Sidebar/>
        )}
        <div className="content">
        <NotificationDisplay />
          <AnimatePresence mode="wait">
            <AnimatedRoutes
              isLoggedIn={isLoggedIn}
              handleLogout={handleLogout}
              userRole={userRole}
              userPermissions={userPermissions}
            />
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}

export default App;
