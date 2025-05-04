import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { taskSchema } from '../validation/taskValidation.js';

// Get tasks (filtered by group and completion status)
export const getTasks = async (req, res) => {
  try {
    console.log("🔹 Přihlášený uživatel:", req.user); // ✅ Logujeme přihlášeného uživatele

    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění pro přístup k To-Do modulu" });
    }

    const { group, completed } = req.query;
    const filter = { userId: req.user.id };

    if (group && group !== "default") filter.group = group;
    if (completed !== undefined) filter.completed = completed.toLowerCase() === 'true';

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

  

// Add task (with group & completed support)
export const addNewTask = async (req, res) => {

  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění přidávat úkoly" });
    }

    const { text, priority, group, completed } = req.body;
    const newTask = new Task({ 
      text, 
      priority, 
      group: group || 'default',
      completed: completed || false,
      userId: req.user.id 
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Update task (mark as completed or edit)
export const updateTask = async (req, res) => {

  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  try {
    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění upravovat úkoly" });
    }

    const { completed, text, priority, group } = req.body;
    const updateFields = {};

    if (completed !== undefined) updateFields.completed = completed;
    if (text) updateFields.text = text;
    if (priority) updateFields.priority = priority;
    if (group) updateFields.group = group;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


// Delete task
export const deleteTask = async (req, res) => {
  try {
    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění mazat úkoly" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid task ID' });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

