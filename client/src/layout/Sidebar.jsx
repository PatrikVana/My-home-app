import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaHome, FaTasks, FaUserShield } from "react-icons/fa";
import { useSelector } from "react-redux";
import LogoutButton from "./LogoutButton";
import "./Sidebar.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const userRole = useSelector((state) => state.auth.role);
  const userPermissions = useSelector((state) => state.auth.permissions);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </button>

      <nav className="menu">
        <Link to="/" className="menu-item">
          <FaHome />
          {!collapsed && <span>Domů</span>}
        </Link>

        {/* ✅ Skryjeme To-Do List, pokud uživatel nemá oprávnění */}
        {userPermissions?.todo && (
          <Link to="/todo" className="menu-item">
            <FaTasks />
            {!collapsed && <span>Úkoly</span>}
          </Link>
        )}


        {/* ✅ Skryjeme poznámky, pokud uživatel nemá oprávnění */}
        {userPermissions?.notes && (
          <Link to="/notes" className="menu-item">
            <FaTasks />
            {!collapsed && <span>Poznámky</span>}
          </Link>
        )}

        {/* ✅ Zobrazíme AdminPanel pouze pro superadmina */}
        {userRole === "superadmin" && (
          <Link to="/admin" className="menu-item">
            <FaUserShield />
            {!collapsed && <span>Správa uživatelů</span>}
          </Link>
        )}

        <LogoutButton collapsed={collapsed} />
      </nav>
    </div>
  );
}

export default Sidebar;

