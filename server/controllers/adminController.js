import User from "../models/User.js";
import Task from "../models/Task.js";
import TaskGroup from "../models/TaskGroup.js";
import mongoose from "mongoose";
import {
  sendApprovalEmail,
  sendStatusChangeEmail,
  sendRoleChangeEmail,
  sendDeleteEmail,
  sendRejectEmail
} from "../services/emailService.js";

// ✅ Získání neschválených registrací
export const getPendingRegistrations = async (req, res) => {
  try {
    const pendingUsers = await User.find({ approved: false });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: "Chyba při načítání žádostí" });
  }
};

// ✅ Schválení registrace uživatele
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });
    res.json({ message: "Registrace schválena", user });
    await sendApprovalEmail(user.email);
  } catch (error) {
    res.status(500).json({ error: "Chyba při schvalování uživatele" });
  }
};

// ✅ Zamítnutí registrace uživatele
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });
    res.json({ message: "Registrace zamítnuta" });
    await sendRejectEmail(user.email); // ✉️ odeslání e-mailu
  } catch (error) {
    res.status(500).json({ error: "Chyba při mazání uživatele" });
  }
};

// ✅ Získání všech uživatelů
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Chyba při načítání uživatelů" });
  }
};

// ✅ Změna role uživatele
export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user", "admin", "superadmin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Neplatná role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });

    user.role = role;
    await user.save();

    res.json({ message: "Role úspěšně změněna", user });
    await sendRoleChangeEmail(user.email, role);
  } catch (error) {
    res.status(500).json({ error: "Chyba při změně role", details: error.message });
  }
};

// ✅ Správa oprávnění uživatele
export const updateUserPermissions = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { permissions: req.body.permissions }, { new: true });
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });
    res.json({ message: "Oprávnění aktualizováno", user });
  } catch (error) {
    res.status(500).json({ error: "Chyba při aktualizaci oprávnění" });
  }
};

// ✅ Změna přístupu uživatele k modulům
export const updateUserAccess = async (req, res) => {
  try {
    const updates = req.body; // např. { todo: true, notes: false }

    console.log(`📢 Backend: změna přístupů pro uživatele ${req.params.id}:`, updates);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Uživatel nenalezen" });

    // Projdeme všechny klíče a hodnoty v těle požadavku
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === "boolean" && user.permissions.hasOwnProperty(key)) {
        user.permissions[key] = value;
      } else {
        console.warn(`⚠️ Neplatný přístupový klíč nebo hodnota: ${key} = ${value}`);
      }
    }

    await user.save();

    console.log(`✅ Přístupy u uživatele ${user.username} aktualizovány:`, user.permissions);
    res.json({ message: "Přístup(y) aktualizován(y)", user });
  } catch (error) {
    console.error("❌ Chyba při změně přístupu:", error);
    res.status(500).json({ error: "Chyba při změně přístupu", details: error.message });
  }
};

// ✅ Aktivace/deaktivace účtu uživatele
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Uživatel nenalezen" });
    }

    user.active = active;
    await user.save();

    res.json({ message: `Uživatel ${active ? "aktivován" : "pozastaven"}`, user });


    await sendStatusChangeEmail(user.email, active);


  } catch (error) {
    console.error("Chyba při změně statusu uživatele:", error);
    res.status(500).json({ error: "Chyba serveru", details: error.message });
  }
};

// ✅ Mazání uživatele a jeho dat
export const deleteUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    console.log("🗑️ Mažu uživatele a jeho data:", userId);

    const deletedTasks = await Task.deleteMany({ userId: userId });
    console.log(`✅ Smazáno ${deletedTasks.deletedCount} úkolů.`);

    const deletedGroups = await TaskGroup.deleteMany({ owner: userId });
    console.log(`✅ Smazáno ${deletedGroups.deletedCount} skupin úkolů.`);

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      console.log("❌ Uživatel nenalezen!");
      return res.status(404).json({ error: "Uživatel nenalezen" });
    }

    console.log("✅ Uživatel úspěšně smazán.");
    res.json({ message: "Uživatel a jeho data úspěšně odstraněny." });
    await sendDeleteEmail(user.email);

  } catch (error) {
    console.error("❌ Chyba při mazání uživatele:", error);
    res.status(500).json({ error: "Chyba při mazání uživatele", details: error.message });
  }
};
