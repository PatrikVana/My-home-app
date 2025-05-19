import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateNote } from "../../../store/notes/notesSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { noteSchema } from "../../../validation/schemas"; 

const EditNoteForm = ({ note, closeModal }) => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const allNotes = useSelector((state) => state.notes.notes); 

  const [noteHeader, setNoteHeader] = useState(note.header);
  const [noteText, setNoteText] = useState(note.text);
  const [color, setColor] = useState(note.color);
  const [group, setGroup] = useState(note.group || "default");
  const [task, setTask] = useState(
    typeof note.task === "object" && note.task !== null ? note.task._id : note.task || "default"
  );
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/noteGroups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(res.data);
    } catch (error) {
      console.error("Chyba při načítání skupin:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = noteSchema.safeParse({
      header: noteHeader,
      text: noteText,
      color,
      group: task === "default" ? group : null,
      task: task !== "default" ? task : null,
    });

    if (!validationResult.success) {
      const shown = new Set();
      validationResult.error.errors.forEach((err) => {
        const msg = err.message;
        const key = `${err.path.join(".")}:${msg}`;
        if (!shown.has(key)) {
          shown.add(key);
          dispatch(addNotification(msg, "error"));
        }
      });
      return;
    }

    const alreadyExists = allNotes.find(
      (n) => n.header === noteHeader && n._id !== note._id
    );

    if (alreadyExists) {
      dispatch(addNotification("Poznámka s tímto názvem již existuje", "warning"));
      return;
    }

    const payload = validationResult.data;

    try {
      const actionPayload = { id: note._id, updates: payload };
      await dispatch(updateNote(actionPayload)).unwrap();
      dispatch(addNotification("Poznámka byla změněna", "success"));
      closeModal();
    } catch {
      dispatch(addNotification("Chyba při změně poznámky", "error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nadpis poznámky</label>
        <input
          type="text"
          className="form-control"
          value={noteHeader}
          onChange={(e) => setNoteHeader(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Text poznámky</label>
        <input
          type="text"
          className="form-control"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Barva poznámky</label>
        <input
          type="color"
          className="form-control form-control-color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Vyber barvu poznámky"
        />
      </div>
      {task === "default" ? (
        <div className="mb-3">
          <label className="form-label">Skupina</label>
          <select
            className="form-control"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="default">Bez skupiny</option>
            {groups.map((g) => (
              <option key={g._id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label">Poznámka úkolu</label>
          <select
            className="form-control"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          >
            <option value="default">Bez úkolu</option>
            {tasks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.text}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Uložit změny
      </button>
    </form>
  );
};
export default EditNoteForm;

