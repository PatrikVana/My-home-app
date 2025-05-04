import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { taskSchema } from "../../../validation/schemas";

function TaskForm({ addTask }) {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('No Important');
  const [group, setGroup] = useState('default');

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // ⬅️ načteme aktuální úkoly
  const groups = useSelector((state) => state.tasks.groups);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validace přes Zod
    const result = taskSchema.safeParse({
      text: task,
      priority,
      group,
    });

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

    // 🧠 Kontrola duplicity
    const duplicate = tasks.find(t => t.text.trim().toLowerCase() === task.trim().toLowerCase());
    if (duplicate) {
      dispatch(addNotification("Úkol s tímto názvem už existuje", "error"));
      return;
    }

    // ✅ Vytvoření úkolu
    const success = await addTask(task, priority, group);
    if (success) {
      setTask('');
      setPriority('No Important');
      setGroup('default');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Zadej úkol"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="No Important">No Important</option>
        <option value="Important">Important</option>
        <option value="High Important">High Important</option>
      </select>
      <select className="form-select" value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="default">Bez skupiny</option>
        {groups.map((g) => (
          <option key={g._id} value={g.name}>{g.name}</option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">Přidat</button>
    </form>
  );
}

export default TaskForm;
