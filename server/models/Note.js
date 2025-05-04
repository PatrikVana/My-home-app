import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  header: { type: String, required: true },
  text: { type: String, required: true },
  color: { type: String, default: null },
  group: { type: String, default: 'default' },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
},
  {
    timestamps: true
  }
);

export default mongoose.model('Note', NoteSchema);