function TaskInput({ task, setTask }) {
    return (
        <div className="task-input">
            <input
                type="text"
                placeholder="Enter a task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
        </div>
    );
}

export default TaskInput;