import React from "react";
import { CircleCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import { useMemo } from "react";
import { deleteTask, updateTask } from "../../../store/tasks/tasksSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import "../styles/TaskList.css";

const TaskList = ({ tasks, selectedGroup, filterCompleted, loading, onEditTask }) => {
  const dispatch = useDispatch();

  const toggleTaskCompletion = async (task) => {
    const updates = {
      text: task.text,
      priority: task.priority,
      group: task.group, 
      completed: !task.completed,
    };

    try {
      await dispatch(updateTask({ id: task._id, updates })).unwrap();
      const message = updates.completed ? "Úkol splněn" : "Úkol vrácen mezi nesplněné";
      dispatch(addNotification(message, "success"));
    } catch {
      dispatch(addNotification("Chyba při změně úkolu", "error"));
    }
  };


  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      dispatch(addNotification("Úkol smazán", "success"));
    } catch {
      dispatch(addNotification("Chyba při mazání úkolu", "error"));
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => selectedGroup === "default" || task.group === selectedGroup)
      .filter((task) => task.completed === filterCompleted);
  }, [tasks, selectedGroup, filterCompleted]);

  return (
    <div className="task-list-main">
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Načítání...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="task-list-container">
          {filteredTasks
            .map((task) => (
              <div key={task._id} className={`task-card ${task.completed ? "completed" : ""}`}>
                <span>{task.text}</span>
                <p className="task-date">
                  Vytvořeno: {new Date(task.createdAt).toLocaleDateString('cs-CZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
                <span className={task.priority === "No Important" ? "task-priority-no-important" : task.priority === "Important" ? "task-priority-important" : "task-priority-high-important"}>{task.priority}</span>
                <div>
                  <button className="check-btn" onClick={() => toggleTaskCompletion(task)}>
                    <i className={task.completed ? "ri-close-line" : "ri-checkbox-circle-line"}></i>
                  </button>
                  <button className="task-edit-btn" onClick={() => onEditTask(task)}><i className="ri-edit-line"></i></button>
                  <button className="task-delete-btn" onClick={() => handleDelete(task._id)}><i className="ri-delete-bin-line"></i></button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
