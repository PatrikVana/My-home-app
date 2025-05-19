import React, { useState, useEffect } from "react";

const UserEditModal = ({ user, closeModal, updateRole, updateAccess }) => {
  const [role, setRole] = useState(user.role);
  const [permissions, setPermissions] = useState(user.permissions || {});

  const moduleLabels = {
    todo: "To-Do Listu",
    notes: "Poznámkám",
    smartHome: "Smart Home",
  };

  useEffect(() => {
    setRole(user.role);
    setPermissions(user.permissions || {});
  }, [user]);

  const handleSave = async () => {
    try {
      let changed = false;

      if (role !== user.role) {
        await updateRole(user._id, role);
        changed = true;
      }

      // Porovnáme přístupy (todo, notes, atd.)
      const changedPermissions = {};
      Object.keys(permissions).forEach((key) => {
        const newValue = permissions[key];
        const currentValue = user.permissions?.[key];

        if (typeof newValue === "boolean" && newValue !== currentValue) {
          changedPermissions[key] = newValue;
        }
      });

      if (Object.keys(changedPermissions).length > 0) {
        await updateAccess(user._id, changedPermissions);
        changed = true;
      }

      closeModal(); 
    } catch (error) {
      console.error("Chyba při ukládání změn:", error);
    }
  };



  const handlePermissionChange = (module) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upravit uživatele: {user.username}</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Role uživatele</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Přístupy k modulům</label>
              {Object.keys(permissions).map((moduleKey) => (
                <div className="form-check" key={moduleKey}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`perm-${moduleKey}`}
                    checked={permissions[moduleKey] || false}
                    onChange={() => handlePermissionChange(moduleKey)}
                  />
                  <label className="form-check-label" htmlFor={`perm-${moduleKey}`}>
                    Přístup k {moduleLabels[moduleKey] || moduleKey}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>Zavřít</button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>Uložit změny</button>
        </div>
        </div>


      </div>
    </div>
  
  );
};

export default UserEditModal;
