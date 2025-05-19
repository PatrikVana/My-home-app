import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaBan } from "react-icons/fa";
import UserEditModal from "../components/UserEditModal";
import {
  fetchPendingUsers,
  fetchAllUsers,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserStatus,
  updateUserRole,
  updateUserAccess,
} from "../../../store/admin/adminSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice"; 

const AdminPanel = () => {
  const dispatch = useDispatch();

  const [view, setView] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { pendingUsers, users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (view === "pending") {
      dispatch(fetchPendingUsers());
    } else if (view === "all") {
      dispatch(fetchAllUsers());
    }
  }, [view]);
  
  const handleApprove = async (id) => {
    await dispatch(approveUser(id)).unwrap();
    dispatch(addNotification("Uživatel schválen.", "success"));
    if (view === "pending") dispatch(fetchPendingUsers());
    else dispatch(fetchAllUsers());
  };
  
  const handleReject = async (id) => {
    await dispatch(rejectUser(id)).unwrap();
    dispatch(addNotification("Registrace zamítnuta.", "info"));
    if (view === "pending") dispatch(fetchPendingUsers());
    else dispatch(fetchAllUsers());
  };
  
  const handleDelete = async (id) => {
    await dispatch(deleteUser(id)).unwrap();
    dispatch(addNotification("Uživatel smazán.", "success"));
    if (view === "all") dispatch(fetchAllUsers());
  };
  
  const handleToggleStatus = async (id, currentStatus) => {
    await dispatch(updateUserStatus({ id, status: !currentStatus })).unwrap();
    dispatch(addNotification(`Uživatel ${!currentStatus ? "aktivován" : "blokován"}.`, "info"));
    if (view === "all") dispatch(fetchAllUsers());
  };
  
  const handleUpdateRole = async (id, role) => {
    await dispatch(updateUserRole({ id, role })).unwrap();
    dispatch(addNotification("Role aktualizována.", "success"));
    if (view === "all") dispatch(fetchAllUsers());
  };
  
  const handleUpdateAccess = async (id, access) => {
    await dispatch(updateUserAccess({ id, access })).unwrap();
    dispatch(addNotification("Přístupy upraveny.", "success"));
    if (view === "all") dispatch(fetchAllUsers());
  };

  return (
    <div className="container mt-4">
      <h2>Správa uživatelů</h2>

      <div className="btn-group mb-3">
        <button className={`btn ${view === "pending" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("pending")}>
          Čekající žádosti
        </button>
        <button className={`btn ${view === "all" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("all")}>
          Všichni uživatelé
        </button>
      </div>

      {view === "pending" && (
        <>
          <h3>Čekající žádosti</h3>
          <ul className="list-group">
            {pendingUsers.map((user) => (
              <li key={user._id} className="list-group-item d-flex justify-content-between">
                {user.username}
                <div>
                  <button className="btn btn-success me-2" onClick={() => handleApprove(user._id)}>Schválit</button>
                  <button className="btn btn-danger" onClick={() => handleReject(user._id)}>Zamítnout</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "all" && (
        <>
          <h3>Všichni uživatelé</h3>
          <ul className="list-group">
            {users.map((user) => (
              <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>{user.username} - {user.role}</div>
                <div>
                  <button className="btn btn-warning me-2" onClick={() => handleToggleStatus(user._id, user.active)}><FaBan /></button>
                  <button className="btn btn-info me-2" onClick={() => { setSelectedUser(user); setModalOpen(true); }}><FaEdit /></button>
                  <button className="btn btn-danger" onClick={() => handleDelete(user._id)}><FaTrash /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {modalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          closeModal={() => setModalOpen(false)}
          updateRole={handleUpdateRole}
          updateAccess={handleUpdateAccess}
        />
      )}
    </div>
  );
};

export default AdminPanel;

