import mongoose from 'mongoose';
import { groupSchema } from '../validation/groupValidation.js';


// Získání všech skupin úkolů pro přihlášeného uživatele
export const getAllGroups = async (req, res, Model) => {
  try {
    console.log("🔹 Přihlášený uživatel:", req.user); // ✅ Logujeme obsah req.user

    if (!req.user || !req.user.id) {
      console.error("🔴 Chyba: req.user není správně nastaven");
      return res.status(401).json({ message: "Unauthorized - Uživatel není přihlášen" });
    }

    const userId = req.user.id;
    const groups = await Model.find({ owner: userId });

    res.json(groups);
  } catch (error) {
    console.error("🔴 Chyba při načítání skupin úkolů:", error);
    res.status(500).json({ message: "Chyba při načítání skupin úkolů", error });
  }
};

// Vytvoření nové skupiny úkolů
export const createNewGroup = async (req, res, Model) => {

  const { error } = groupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Název skupiny je povinný" });
    }

    const userId = req.user.id; // ID přihlášeného uživatele z middleware
    const newGroup = new Model({ name, owner: userId });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Chyba při vytváření skupiny", error });
  }
};

//Smazání skupiny
export const deleteGroup = async (req, res, GroupModel, Model) => {
  try {

    if (GroupModel.modelName === "NoteGroup" && !req.user.permissions?.notes) {
      return res.status(403).json({ message: "Nemáte oprávnění mazat poznámkové skupiny" });
    }
    if (GroupModel.modelName === "TaskGroup" && !req.user.permissions?.todo) {
      return res.status(403).json({ message: "Nemáte oprávnění mazat skupiny úkolů" });
    }


    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const deletedGroup = await GroupModel.findById(req.params.id);
    if (!deletedGroup) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Smazání všech dokumentů v dané skupině
    await Model.deleteMany({ group: deletedGroup.name });

    await GroupModel.findByIdAndDelete(req.params.id);
    res.json({ id: req.params.id, message: `${GroupModel.modelName} a jeho položky byly smazány` });

  } catch (error) {
    console.error("❌ Chyba při mazání Group:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
