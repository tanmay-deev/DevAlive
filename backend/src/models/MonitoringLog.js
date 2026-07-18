import mongoose from 'mongoose';

const monitoringLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'timeout', 'error'],
    required: true
  },
  httpStatusCode: {
    type: Number
  },
  responseTime: {
    type: Number // Milliseconds
  },
  errorMessage: {
    type: String
  },
  checkedAt: {
    type: Date,
    default: Date.now,
    index: -1,
    expires: '30d' // Automatically delete logs older than 30 days
  }
}, {
  timestamps: true
});

export default mongoose.model('MonitoringLog', monitoringLogSchema);
