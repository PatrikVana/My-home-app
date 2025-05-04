import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTasks,
  fetchTaskGroups,
  addTask,
} from "../../../store/tasks/tasksSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";

import "bootstrap/dist/css/bootstrap.min.css";
import TaskList from "../components/TaskList";
import TaskGroups from "../components/TaskGroups";
import TaskDetail from "../components/TaskDetail";
import TaskForm from "../components/TaskForm";
import "../styles/TodoPage.css";

const TodoPage = () => {
  const dispatch = useDispatch();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("default");
  const [filterCompleted, setFilterCompleted] = useState(false);

  const { tasks, groups: taskGroups, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks({ group: selectedGroup, completed: filterCompleted }));
  }, [dispatch, selectedGroup, filterCompleted]);


  useEffect(() => {
    if (taskGroups.length === 0) {
      dispatch(fetchTaskGroups());
    }
  }, [taskGroups.length]);


  const handleAddTask = async (text, priority, group) => {
    try {
      const taskData = { text, priority, group };
      console.log("Přidávám úkol:", taskData);
      await dispatch(addTask(taskData)).unwrap();
      console.log("Úkol přidán");
      dispatch(addNotification("Úkol přidán", "success"));

      return true;
    } catch {
      console.error("Chyba při vytváření úkolu", error);
      dispatch(addNotification("Chyba při vytváření úkolu", "error"));
      return false;
    }

  };


  return (
    <div className="todo-page">
      <div className="task-groups">
        <TaskGroups
          taskGroups={taskGroups}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      </div>

      <div className="main-content">
        <div className="task-container">
          <div className={`task-list ${selectedTask ? "shrink" : ""}`}>
            <div className="header">
              <h1>To-Do List</h1>
              <button className="add-task-button" onClick={() => setShowModal(true)}>
                <i className="ri-add-line"></i>
              </button>
            </div>

            <div className="filter-section">
              <button
                className="btn btn-info"
                onClick={() => setFilterCompleted(!filterCompleted)}
              >
                {filterCompleted ? "Zobrazit nesplněné" : "Zobrazit splněné"}
              </button>
            </div>

            <TaskList
              tasks={tasks}
              selectedGroup={selectedGroup}
              filterCompleted={filterCompleted}
              loading={loading}
              onEditTask={(task) => setSelectedTask(task)}
            />
          </div>

          {selectedTask && (
            <TaskDetail
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Přidat nový úkol</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <TaskForm
                    addTask={async (text, priority, group) => {
                      console.log("Volám handleAddTask");
                      const success = await handleAddTask(text, priority, group);
                      console.log("Výsledek:", success);
                      if (success) {
                        setShowModal(false);
                        console.log("Zavírám modál");
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoPage;
