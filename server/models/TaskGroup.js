import mongoose from "mongoose";

const TaskGroupSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Název skupiny musí být unikátní
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Odkaz na uživatele, který skupinu vytvořil
});

TaskGroupSchema.index({ name: 1, owner: 1 }, { unique: true });

export default mongoose.model("TaskGroup", TaskGroupSchema);
 