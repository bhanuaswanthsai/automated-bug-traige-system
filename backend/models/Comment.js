import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  bugId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bug', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
