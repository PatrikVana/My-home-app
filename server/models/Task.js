import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  priority: { type: String, default: 'No Important' },
  completed: { type: Boolean, default: false },
  group: { type: String, default: 'default' },

},
  { timestamps: true }
);

export default mongoose.model('Task', TaskSchema);