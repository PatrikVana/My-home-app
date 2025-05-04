import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNote } from "../../../store/notes/notesSlice";
import { fetchTasks } from "../../../store/tasks/tasksSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { noteSchema } from "../../../validation/schemas";

export default function NoteForm({ groups, closeModal }) {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { notes } = useSelector((state) => state.notes); // 🟡 pro kontrolu duplicity

  const [header, setHeader] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [group, setGroup] = useState("default");
  const [taskNote, setTaskNote] = useState(false);
  const [task, setTask] = useState("default");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      header,
      text,
      color,
      group: taskNote ? undefined : group,
      task: taskNote && task !== "default" ? task : undefined,
    };

    // ✅ Validace přes Zod
    const result = noteSchema.safeParse(noteData);

    if (!result.success) {
      const shown = new Set();
      result.error.errors.forEach((err) => {
        const msg = err.message;
        const key = `${err.path.join(".")}:${msg}`;
        if (!shown.has(key)) {
          shown.add(key);
          dispatch(addNotification(msg, "error"));
        }
      });
      return;
    }

    // 🔁 Kontrola duplicity
    const alreadyExists = notes.find((n) =>
      n.header === header && (taskNote ? n.task === task : n.group === group)
    );
    if (alreadyExists) {
      dispatch(addNotification("Poznámka se stejným názvem už existuje", "warning"));
      return;
    }

    try {
      await dispatch(addNote(noteData)).unwrap();
      dispatch(addNotification("Poznámka přidána", "success"));

      // Reset
      setHeader("");
      setText("");
      setColor("#ffffff");
      setGroup("default");
      setTask("default");
      setTaskNote(false);
      if (closeModal) closeModal();
    } catch {
      dispatch(addNotification("Chyba při vytváření poznámky", "error"));
    }
  };

  useEffect(() => {
    if (tasks.length === 0) {
      console.log("⏳ Načítám úkoly...");
      dispatch(fetchTasks());
      console.log("📋 Tasks:", tasks);
    }
  }, [tasks, dispatch]);
  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <input
        type="text"
        placeholder="Název poznámky"
        value={header}
        onChange={(e) => setHeader(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Text poznámky"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        cols={30}
      />
      <br />
      <label>
        Barva:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          name="taskNote"
          checked={taskNote}
          onChange={(e) => setTaskNote(e.target.checked)}
        />{" "}
        Switch to Task Note.
      </label>

      {taskNote ? (
        <label>
          Úkol:
          <select value={task} onChange={(e) => setTask(e.target.value)}>
            <option value="default">Žádný úkol</option>
            {tasks.map((t) => (
              <option key={t._id} value={t._id}>
                {t.text}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label>
          Skupina:
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="default">Žádná skupina</option>
            {groups.map((g) => (
              <option key={g._id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <br />
      <button type="submit">➕ Přidat poznámku</button>
    </form>
  );
}
