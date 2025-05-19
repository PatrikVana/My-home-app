import mongoose from 'mongoose';
import Note from '../models/Note.js';
import { noteSchema } from '../validation/noteValidation.js';

// Získání všech Poznámek
export const getNotes = async (req, res) => {
    try {
        // Kontrola zda má uživatel oprávnění používat modul poznámek
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění pro přístup k Note modulu" });
        }
        // načtení hodnoty group z requestu
        const { group } = req.query;
        // vytvoření objektu filter, doplnění hodnoty userId
        const filter = { userId: req.user.id };
        // Pokud hodnota group existuje a není nastavená na default vložím hodnotu group z requestu do objektu filter
        if (group && group !== "default") filter.group = group;
        // načtení všech poznámek podle objektu filter, tedy userId a group
        const notes = await Note.find(filter);
        //vracím úspěšnou odpověď s kódem 200 a poznámkami ve formátu json
        res.status(200).json(notes);
    } catch (error) {
        //vracím neúspěšnou odpověď s kódem 500 a zprávou ve formátu json
        res.status(500).json({ error: error.message || 'Něco se pokazilo' });
    }
};



// Přidání nové poznámky
export const addNewNote = async (req, res) => {
    // validace vstupních dat pomocí note schematu, načtení erroru v případě chyby.
    const { error } = noteSchema.validate(req.body);
    if (error) {
        // vrácení neúspěšné odpovědi s kódem 400 se zprávou s errorem
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Kontrola zda má uživatel oprávnění používat modul poznámek
        if (!req.user.permissions?.notes) {
            return res.status(403).json({ message: "Nemáte oprávnění přidávat poznámku" });
        }
        // načtení header, text, color, group, task hodnot z requestu
        const { header, text, color, group, task } = req.body;
        //vytvoření nového objektu poznámky, vložím do něj načtené hodnoty z requestu (group pokud není = default, task pokud není = null)
        const newNote = new Note({
            header,
            text,
            color,
            group: group || 'default',
            userId: req.user.id,
            task: task || null
        });
        // Uložení nové poznámky
        await newNote.save();
        //vracím úspěšnou odpověď s kódem 201 a aktualizovanou poznámkami ve formátu json
        res.status(201).json(newNote);
    } catch (error) {
        //vracím neúspěšnou odpověď s kódem 500 se zprávou ve formátu json
        res.status(500).json({ error: error.message || 'Něco se pokazilo' });
    }
};


// Updatování poznámky
export const updateNote = async (req, res) => {
    // validace vstupních dat pomocí note schematu, načtení erroru v případě chyby.
    const { error } = noteSchema.validate(req.body);
    if (error) {
        // vrácení neúspěšné odpovědi s kódem 400 se zprávou s errorem
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Kontrola zda má uživatel oprávnění používat modul poznámek
        if (!req.user.permissions?.notes) {
            // vrácení neúspěšné odpovědi s kódem 403 se zprávou
            return res.status(403).json({ message: "Nemáte oprávnění upravovat poznámky" });
        }
        // načtení header, text, color, group, task hodnot z requestu pro aktualizci poznámky
        const { header, text, color, group, task } = req.body;
        //vytvoření nového objektu poznámky, vložím do něj načtené hodnoty z requestu
        const updateFields = {
            ...(header && { header }),
            ...(text && { text }),
            ...(color && { color }),
        };

        // Pokud hodnota group existuje, vložím hodnotu group z requestu do objektu filter
        if (group !== undefined) updateFields.group = group;
        // Pokud hodnota task existuje, vložím hodnotu group z requestu do objektu filter
        if (task !== undefined) updateFields.task = task;
        // načtení a aktualizování poznámky na základě id a hodnot objektu updateFields
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        // kontrola zda je aktualizovaná poznámka načtená
        if (!updatedNote) {
            return res.status(404).json({ error: "Poznámka nenalezena" });
        }
        //vracím odpověď s aktualizovanou poznámkou ve formátu json
        res.json(updatedNote);
    } catch (error) {
        //vracím neúspěšnou odpověď s kódem 500 se zprávou ve formátu json
        res.status(500).json({ error: error.message || 'Něco se pokazilo' });
    }
};



// Odstranění poznámky
export const deleteNote = async (req, res) => {
    try {
        // Kontrola zda má uživatel oprávnění používat modul poznámek
        if (!req.user.permissions?.notes) {
            // vrácení neúspěšné odpovědi s kódem 403 se zprávou
            return res.status(403).json({ message: "Nemáte oprávnění mazat poznámku" });
        }
        // Kontrola správného formátu id poznámky
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Nesprávný formát ID' });
        }
        // načtení a odstranění poznámky na základě id poznámky
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        // kontrola zda je odstraněná poznámka načtená
        if (!deletedNote) {
            return res.status(404).json({ error: 'Poznámka nenalezena' });
        }
        //vracím odpověď se zprávou že byla poznámka odstraněna
        res.json({ message: 'Note deleted' });
    } catch (error) {
        //vracím neúspěšnou odpověď s kódem 500 se zprávou ve formátu json
        res.status(500).json({ error: error.message || 'Něco se pokazilo' });
    }
};

