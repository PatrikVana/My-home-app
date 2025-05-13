import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { taskSchema } from '../validation/taskValidation.js';

/*Získání všech úkolů podle filtrování 
  (
    1. je nebo není úkol označen jako dokončený
    2. úkol má zadanou konkrétní skupinu 
  )
  - Ověření zda má uživatel přístup k todo listu (hodnota permissions = {todo = "true"})
  - načttení hodnot group a completed z requestu
  - vytvoření objektu filter s hodnotou "userId : id uživatele z requestu"
  - Pokud group hodnota v requestu existuje a není nastavená na "default" přiřadím jí do objektu filter 
  - Pokud je stanovena hodnota completed v requestu přiřadím jí do objektu filter
  - vytvoření proměné tasks do které nahraju všechny úkoly podle stanovených hodnot (userId, group, completed) objektu filter
  - v případě úspěchu posílám odpověď s kódem 200 a všechny úkoly ve formátu json
  - v případě neúspěchu posílám odpověď s kódem 500 a zprávou ve formátu json

*/
export const getTasks = async (req, res) => {
  try {

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
    res.status(500).json({ error: 'Něco se pokazilo' });
  }
};



/* Přidání nového úkolu do databáze
  - validování vstupních hodnot podle taskSchematu 
  - kontrola da jsou data validována jako neplatná, pokud ano vracím odpověď s kódem 400 a zprávou erroru z validace
  - Ověření zda má uživatel přístup k todo listu (hodnota permissions = {todo = "true"}), pokud ne vracím odpověď s kódem 403 a zprávou
  - načttení hodnot text, priority, group, completed z requestu
  - vytvoření nového objektu schematu Task s načtenými hodnotami (group a completed mají výchozí hodnotu pokud nejsou zadány)
  - uložení nového objektu 
  - v případě úspěchu posílám odpověď s kódem 200 a nový vytvořený task ve formátu json
  - v případě neúspěchu posílám odpověď s kódem 500 a zprávou ve formátu json
*/
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
    res.status(500).json({ error: 'Něco se pokazilo' });
  }
};


/* aktualizace tasku v databázi podle id
  - validování vstupních hodnot podle taskSchematu 
  - kontrola da jsou data validována jako neplatná, pokud ano vracím odpověď s kódem 400 a zprávou erroru z validace
  - Ověření zda má uživatel přístup k todo listu (hodnota permissions = {todo = "true"}), pokud ne vracím odpověď s kódem 403 a zprávou
  - načttení hodnot text, priority, group, completed z requestu
  - vytvoření objektu updateFields
  - Pokud text hodnota v requestu existuje přiřadím jí do objektu updateFields
  - Pokud priority hodnota v requestu existuje přiřadím jí do objektu updateFields
  - Pokud group hodnota v requestu existuje přiřadím jí do objektu updateFields
  - Pokud je completed hodnota definovaná přiřadím jí do objektu updateFields
  - vytvořím proměnou updatedTask a vložím do ní pomocí funkce findByIdAndUpdate aktualizovaný task(najdu id a vložím hodnoty z updateFields)
  - Pokud je updatedTask false posílám odpověď s kódem 404 a zprávou v json formátu
  - v případě úspěchu posílám odpověď s kódem 200 a aktualizovaný task ve formátu json
  - v případě neúspěchu posílám odpověď s kódem 500 a zprávou ve formátu json
*/
export const updateTask = async (req, res) => {

  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění upravovat úkoly" });
    }

    const { text, priority, group, completed } = req.body;
    const updateFields = {};

    if (text) updateFields.text = text;
    if (priority) updateFields.priority = priority;
    if (group) updateFields.group = group;
    if (completed !== undefined) updateFields.completed = completed;

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Něco se pokazilo' });
  }
};


/*odstranění úkolu podle id
  - Ověření zda má uživatel přístup k todo listu (hodnota permissions = {todo = "true"}), pokud ne vracím odpověď s kódem 403 a zprávou
  - Validace správného ID, pokud je nesprávné posílám odpověď s kódem 400 a správou v json formátu
  - vytvořím proměnou deletedTask a vložím do ní pomocí funkce findByIdAndDelete úkol který mažu pomocí jeho id
  - Pokud je deletedTask false posílám odpověď s kódem 404 a zprávou v json formátu
  - v případě úspěchu posílám odpověď s kódem 200 a zprávou ve formátu json
  - v případě neúspěchu posílám odpověď s kódem 500 a zprávou ve formátu json
*/
export const deleteTask = async (req, res) => {
  try {
    if (!req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění mazat úkoly" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Nesprávné ID' });
    }

    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Úkol nenalezen' });
    }

    res.json({ message: 'Úkol smazán' });
  } catch (error) {
    res.status(500).json({ error: 'Něco se pokazilo' });
  }
};

