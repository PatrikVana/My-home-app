import { getAllGroups, createNewGroup, deleteGroup } from "../utils/groupControllerUtils.js";
import TaskGroup from "../models/TaskGroup.js"; // Ujisti se, že máš model TaskGroup
import Task from "../models/Task.js";


export const createNewTaskGroup = (req, res) => createNewGroup(req, res, TaskGroup);
export const getAllTaskGroups = (req, res) => getAllGroups(req, res, TaskGroup);
export const deleteExistTaskGroup =  (req, res) => deleteGroup(req, res, TaskGroup, Task );

