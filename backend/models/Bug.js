import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  stepsToReproduce: { type: String },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  priority: { 
    type: String, 
    enum: ['P1', 'P2', 'P3', 'P4'],
    default: 'P4'
  },
  category: { 
    type: String, 
    enum: ['UI', 'Backend', 'Performance', 'Security', 'Other'],
    default: 'Other'
  },
  status: { 
    type: String, 
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  screenshotUrl: { type: String },
  confidenceScore: { type: Number, default: 0 },
  module: { type: String }
}, { timestamps: true });

export default mongoose.model('Bug', bugSchema);
