import express from 'express';
import { getNotes, addNewNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authenticate, getNotes);
router.post('/', authenticate, addNewNote);
router.put('/:id', authenticate, updateNote);
router.delete('/:id', authenticate, deleteNote);


export default router;