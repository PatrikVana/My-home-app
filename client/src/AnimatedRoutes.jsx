import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import Login from "./modules/auth/pages/LoginPage";
import Register from "./modules/auth/pages/RegistrationPage";
import Home from "../src/modules/home/HomePage";
import TodoPage from "./modules/tasks/pages/TodoPage";
import NotesPage from "./modules/notes/pages/NotesPage";
import AdminPanel from "./modules/admin/pages/AdminPage";

function AnimatedRoutes({ isLoggedIn, handleLogin, userRole, tasks, addTask, deleteTask, updateTask, loading, taskGroups, selectedGroup, setSelectedGroup, filterCompleted, setFilterCompleted, fetchTaskGroups, fetchTasks }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/todo" element={<TodoPage/>}/>
            <Route path="/notes" element={<NotesPage/>}></Route>
            {userRole === "superadmin" && (
              <Route path="/admin" element={<AdminPanel />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
