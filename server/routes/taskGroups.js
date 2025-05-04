import express from "express";
import { getAllTaskGroups, createNewTaskGroup, deleteExistTaskGroup } from "../controllers/taskGroupsController.js";
import { authenticate } from "../middleware/auth.js"; // Middleware pro ověření uživatele

const router = express.Router();

router.get("/", authenticate, getAllTaskGroups);
router.post("/", authenticate, createNewTaskGroup);
router.delete('/:id', authenticate, deleteExistTaskGroup);

export default router;