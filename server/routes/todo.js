import express from 'express';
import { getTasks, addNewTask, updateTask, deleteTask } from '../controllers/todoController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticate, getTasks);
router.post('/', authenticate, addNewTask);
router.put('/:id', authenticate, updateTask);
router.delete('/:id', authenticate, deleteTask);


export default router;