import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskGroups, updateTask } from "../../../store/tasks/tasksSlice";
import { selectTaskGroups } from "../../../store/tasks/taskSelectors";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import { taskSchema } from "../../../validation/schemas";

const EditTaskForm = ({ task, closeModal }) => {
  const [taskText, setTaskText] = useState(task.text);
  const [priority, setPriority] = useState(task.priority);
  const [group, setGroup] = useState(task.group || "default");

  const dispatch = useDispatch();
  const groups = useSelector(selectTaskGroups);
  const tasks = useSelector((state) => state.tasks.tasks); // ⬅️ získání všech úkolů

  useEffect(() => {
    if (groups.length === 0) {
      dispatch(fetchTaskGroups());
    }
  }, [groups, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validace pomocí Zod
    const validationResult = taskSchema.safeParse({
      text: taskText,
      priority,
      group,
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

    // ✅ Kontrola duplicity (kromě aktuálního tasku)
    const alreadyExists = tasks.some(
      (t) => t.text.trim().toLowerCase() === taskText.trim().toLowerCase() && t._id !== task._id
    );

    if (alreadyExists) {
      dispatch(addNotification("Úkol s tímto názvem už existuje", "warning"));
      return;
    }

    try {
      const actionPayload = { id: task._id, updates: validationResult.data };
      await dispatch(updateTask(actionPayload)).unwrap();
      dispatch(addNotification("Úkol byl změněn", "success"));
      closeModal();
    } catch {
      dispatch(addNotification("Chyba při změně úkolu", "error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Text úkolu</label>
        <input
          type="text"
          className="form-control"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Priorita</label>
        <select
          className="form-control"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="No Important">No Important</option>
          <option value="Important">Important</option>
          <option value="High Important">High Important</option>
        </select>
      </div>

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

      <button type="submit" className="btn btn-primary">
        Uložit změny
      </button>
    </form>
  );
};

export default EditTaskForm;
