import mongoose from 'mongoose';
import Note from '../models/Note.js';
import { noteSchema } from '../validation/noteValidation.js';

// Získání Poznámek
export const getNotes = async (req, res) => {
    try {
        console.log("🔹 Přihlášený uživatel:", req.user); //Log přihlášeného uživatele
        // Kontrola oprávnění k poznámkovému modulu
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění pro přístup k Note modulu" });
        }

        const { group } = req.query;
        const filter = { userId: req.user.id };

        if (group && group !== "default") filter.group = group;

        const notes = await Note.find(filter);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};



// Přidání Poznámky
export const addNewNote = async (req, res) => {

    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Kontrola oprávnění k poznámkovému modulu
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění přidávat poznámku" });
        }

        const { header, text, color, group, task } = req.body;
        // Log nové poznámky
        console.log("🟡 Nová poznámka přijata:", { header, text, color, group, task });

        const newNote = new Note({
            header,
            text,
            color,
            group: group || 'default',
            userId: req.user.id,
            task: task || null
        });
        // Uložení poznámky
        await newNote.save();

        console.log("🟢 Poznámka uložena:", newNote);

        res.status(201).json(newNote);
    } catch (error) {
        console.error("❌ Chyba při ukládání poznámky:", error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
    }
};


// Updatování poznámky
export const updateNote = async (req, res) => {

    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Kontrola oprávnění k poznámkovému modulu
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění upravovat poznámky" });
        }

        const { header, text, color, group, task } = req.body;

        const updateFields = {
            ...(header && { header }),
            ...(text && { text }),
            ...(color && { color }),
        };

        // Podmíné přidání group/task
        if (group !== undefined) updateFields.group = group;
        if (task !== undefined) updateFields.task = task;
        //Updatetování poznámky
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedNote) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error("❌ Chyba při aktualizaci poznámky:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};



// Odstranění poznámky
export const deleteNote = async (req, res) => {
    try {
        // Kontrola oprávnění k poznámkovému modulu
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění mazat poznámku" });
        }
        // Kontrola id poznámky
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid note ID' });
        }
        // odstranění poznámky
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

