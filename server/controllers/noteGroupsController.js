import { getAllGroups, createNewGroup, deleteGroup } from "../utils/groupControllerUtils.js";
import NoteGroup from "../models/NoteGroup.js";
import Note from '../models/Note.js';

export const createNewNoteGroup = (req, res) => createNewGroup(req, res, NoteGroup);
export const getAllNoteGroups = (req, res) => getAllGroups(req, res, NoteGroup);
export const deleteExistNoteGroup =  (req, res) => deleteGroup(req, res, NoteGroup, Note);