function TaskSelect({ priority, setPriority }) {
    return (
        <div className="task-select">
            <label>Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="No Important">No Important</option>
                <option value="Important">Important</option>
                <option value="High Important">High Important</option>
            </select>
        </div>
    );
}

export default TaskSelect;