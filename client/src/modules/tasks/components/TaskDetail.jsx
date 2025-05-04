import { X } from "lucide-react";
import "../styles/TaskDetail.css";
import EditTaskForm from "./EditTaskForm";

const TaskDetail = ({ task, onClose }) => {
  return (
    <div className={`task-detail ${task ? "open" : ""}`}>
      {/* Zavírací tlačítko */}
      <button className="close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* Titulek */}
      <h2>Upravit úkol</h2>

      {/* Formulář pro editaci úkolu */}
      <EditTaskForm task={task} closeModal={onClose} />
    </div>
  );
};

export default TaskDetail;
