import mongoose from 'mongoose';
import Task from './Task.js';
import TaskGroup from './TaskGroup.js';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // ✅ Validace emailu
  },
  password: { 
    type: String, 
    required: true,
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "other"], // ✅ Možnosti pohlaví
    default: null, // ✅ Nemusí být vyplněno
  },
  role: { 
    type: String, 
    enum: ["superadmin", "admin", "user"], 
    default: "user",
  },
  approved: { 
    type: Boolean, 
    default: false 
  },
  permissions: {
    todo: { type: Boolean, default: true },
    notes: { type: Boolean, default: true }
  },
  active: { 
    type: Boolean, 
    default: true 
  },
});

// ✅ Middleware pro automatické smazání úkolů a skupin při mazání uživatele
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  console.log(`🗑️ Automaticky mažu úkoly a skupiny uživatele ${userId}`);

  await Task.deleteMany({ user: userId });
  await TaskGroup.deleteMany({ user: userId });

  next();
});

export default mongoose.model('User', userSchema);

