import mongoose from "mongoose";

const NoteGroupSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Název skupiny musí být unikátní
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Odkaz na uživatele, který skupinu vytvořil
});

// Každý uživatel může mít skupiny, ale ne dvě stejné
NoteGroupSchema.index({ name: 1, owner: 1 }, { unique: true });

export default mongoose.model("NoteGroup", NoteGroupSchema);