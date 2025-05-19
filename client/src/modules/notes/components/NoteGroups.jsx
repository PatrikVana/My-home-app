import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNoteGroup, deleteNoteGroup, fetchNotes } from "../../../store/notes/notesSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { groupSchema } from "../../../validation/schemas"; 
import "../styles/NoteGroups.css";

const NoteGroups = ({
  selectedTaskId,
  setSelectedTaskId,
  mode,
  selectedGroup,
  setSelectedGroup,
}) => {
  const [newGroup, setNewGroup] = useState("");
  const dispatch = useDispatch();
  const noteGroups = useSelector((state) => state.notes.groups);
  const tasks = useSelector((state) => state.tasks.tasks);

  const handleCreateGroup = async () => {
    const validation = groupSchema.safeParse({ name: newGroup });

    if (!validation.success) {
      const shown = new Set();
      validation.error.errors.forEach((err) => {
        const msg = err.message;
        const key = `${err.path.join(".")}:${msg}`;
        if (!shown.has(key)) {
          shown.add(key);
          dispatch(addNotification(msg, "error"));
        }
      });
      return;
    }

    if (noteGroups.some((g) => g.name.toLowerCase() === newGroup.trim().toLowerCase())) {
      dispatch(addNotification("Skupina s tímto názvem už existuje", "warning"));
      return;
    }

    try {
      await dispatch(addNoteGroup(newGroup.trim())).unwrap();
      dispatch(addNotification("Skupina přidána", "success"));
      setNewGroup("");
    } catch (error) {
      console.error("Chyba při přidání skupiny:", error);
      dispatch(addNotification("Chyba při přidávání skupiny", "error"));
    }
  };

  const handleDeleteGroup = async (id, name) => {
    try {
      await dispatch(deleteNoteGroup(id)).unwrap();
      dispatch(addNotification("Skupina odstraněna", "success"));

      if (selectedGroup === name) {
        setSelectedGroup("default");
      }

      dispatch(fetchNotes({ group: "default", completed: false }));

    } catch (error) {
      console.error("Chyba při mazání skupiny:", error);
      dispatch(addNotification("Chyba při mazání skupiny", "error"));
    }
  };

  return (
    <div className="note-groups-inner">
      <h4 className="groups-header">Skupiny poznámek</h4>

      {mode === "classic" ? (
        <>
           <ul className="note-list-group">
            <li
              className={`list-group-item ${selectedGroup === "default" ? "active" : ""}`}
              onClick={() => setSelectedGroup("default")}
              style={{ cursor: "pointer" }}
            >
              Všechny poznámky
            </li>
            {noteGroups.map((group) => (
              <li
                key={group._id}
                className={`list-group-item ${selectedGroup === group.name ? "active" : ""}`}
                onClick={() => setSelectedGroup(group.name)}
                style={{ cursor: "pointer" }}
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
              </li>
            ))}

          </ul>

          <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Název nové skupiny"
            value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
           />
           <button className="btn-note-group-add" onClick={handleCreateGroup}>
              <i className="ri-add-line note-group-plus-icon"></i>
            </button>
          </div>
          
        </>

  ) : (
    <>
      <ul className="note-list-group">
        <li
          className={`list-group-item ${selectedTaskId === "default" ? "active" : ""}`}
          onClick={() => setSelectedTaskId("default")}
          style={{ cursor: "pointer" }}
        >
          Všechny úkoly
        </li>
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`list-group-item ${selectedTaskId === task._id ? "active" : ""}`}
            onClick={() => setSelectedTaskId(task._id)}
            style={{ cursor: "pointer" }}
          >
            {task.text}
          </li>
        ))}
      </ul>
    </>
  )
}
</div >
  );
};

export default NoteGroups;
