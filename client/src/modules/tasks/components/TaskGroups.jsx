import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTaskGroup, deleteTaskGroup, fetchTasks } from "../../../store/tasks/tasksSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { groupSchema } from "../../../validation/schemas";
import "../styles/TaskGroups.css";
import { AnimatePresence, motion } from "framer-motion";

const TaskGroups = ({ taskGroups, selectedGroup, setSelectedGroup }) => {
  const [newGroup, setNewGroup] = useState("");
  const dispatch = useDispatch();

  const handleCreateGroup = async () => {
    const trimmedGroup = newGroup.trim();

    const result = groupSchema.safeParse({ name: trimmedGroup });
    if (!result.success) {
      const uniqueErrors = new Set(result.error.errors.map(err => err.message));
      uniqueErrors.forEach((msg) => dispatch(addNotification(msg, "error")));
      return;
    }

    const exists = taskGroups.some((group) => group.name.toLowerCase() === trimmedGroup.toLowerCase());
    if (exists) {
      dispatch(addNotification("Skupina s tímto názvem již existuje", "error"));
      return;
    }

    try {
      await dispatch(addTaskGroup(trimmedGroup)).unwrap();
      dispatch(addNotification("Skupina úkolů přidána", "success"));
      setNewGroup("");
    } catch {
      dispatch(addNotification("Chyba při přidávání skupiny", "error"));
    }
  };

  const handleDeleteGroup = async (id, name) => {
    try {
      await dispatch(deleteTaskGroup(id)).unwrap();
      dispatch(addNotification("Skupina úkolů odstraněna", "success"));

      // Pokud je právě vybraná skupina ta, kterou mažu, přepnu na default
      if (selectedGroup === name) {
        setSelectedGroup("default");
      }

      // ✅ Načtu úkoly znovu, aby zmizely i ty, které se mazaly
      dispatch(fetchTasks({ group: "default", completed: false }));
    } catch {
      dispatch(addNotification("Chyba při odstraňování skupiny", "error"));
    }
  };

  return (
    <div className="task-groups-inner">
      <h4 className="groups-header">Skupiny úkolů</h4>
      <ul className="task-list-group">

        <li
          className={`list-group-item ${selectedGroup === "default" ? "active" : ""}`}
          onClick={() => setSelectedGroup("default")}
          style={{ cursor: "pointer" }}
        >
          Všechny úkoly
        </li>
        <AnimatePresence>
          {(taskGroups || []).map((group) => (
            <motion.li
              key={group._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`list-group-item ${selectedGroup === group.name ? "active" : ""}`}
              onClick={() => setSelectedGroup(group.name)}
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {group.name}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group._id, group.name);
                }}
              >
                ✖
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="input-group mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Název nové skupiny"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
        />
        <button className="btn-task-group-add" onClick={handleCreateGroup}>
          <i className="ri-add-line task-group-plus-icon"></i>
        </button>
      </div>
    </div>
  );
};

export default TaskGroups;
