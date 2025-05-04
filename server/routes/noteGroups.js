import express from "express";
import { getAllNoteGroups, createNewNoteGroup, deleteExistNoteGroup } from "../controllers/noteGroupsController.js";
import { authenticate } from "../middleware/auth.js"; // Middleware pro ověření uživatele

const router = express.Router();

router.get("/", authenticate, getAllNoteGroups);
router.post("/", authenticate, createNewNoteGroup);
router.delete('/:id', authenticate, deleteExistNoteGroup);

export default router;